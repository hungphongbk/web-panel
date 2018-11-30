import { spawn } from "child_process";
import { ab2str } from "../../universal/utils";

export function _shellCommand(cmd, onData = () => {}, _processOpts = {}) {
  const processOpts = Object.assign(
    {},
    { cwd: undefined, env: process.env },
    _processOpts
  );
  return (logger = null) =>
    new Promise(resolve => {
      logger && logger({ cmd });
      const childProcess = spawn(cmd + " 2>&1", {
        stdio: "pipe",
        shell: true,
        ...processOpts
      });
      childProcess.stdout.on("data", data => onData(ab2str(data)));
      childProcess.on("close", resolve);
    });
}

export function _shellCommandAsync(cmd, _processOpts = {}) {
  return async logger => {
    let data = "";
    await _shellCommand(cmd, d => (data = d), _processOpts)(logger);
    return data;
  };
}

/**
 * Get UID of specific user
 *
 * @param username
 * @returns {Promise<number>}
 * @private
 */
export function _uid(username) {
  let uid = "";
  return _shellCommand(`id -u ${username}`, data => (uid = data))().then(
    () => uid.trim() * 1
  );
}

export async function _homeDir(username) {
  let homeDir = await _shellCommandAsync(`eval echo "~${username}"`)();
  return homeDir.trim();
}

export function _mkDir(dir, uid, permission = "644") {
  return logger =>
    _shellCommandAsync(`mkdir -p ${dir}; chmod ${dir} ${permission}`, {
      uid
    })(logger);
}
