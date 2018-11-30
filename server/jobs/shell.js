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

export async function _homeDir(username) {
  let homeDir = await _shellCommandAsync(`eval echo "~${username}"`)();
  return homeDir.trim();
}
