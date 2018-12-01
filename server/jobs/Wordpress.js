import { _homeDir, _mkDir, _shellCommandAsync } from "./shell";
import path from "path";
import NginxJobs from "./Nginx";

const _mysqlDbHost =
  process.env.NODE_ENV === "development" ? "188.166.177.127" : "localhost";

const createHomeDir = model => async (logger = () => {}) => {
  await model.ensureUser();
  const { dbUser, domain, uid } = model,
    homeDir = await _homeDir(dbUser);

  model.uid = uid;

  const wpHomeDir = (model.wpHomeDir = path.join(homeDir, "www", domain));

  await _mkDir(wpHomeDir, uid)(logger);
  return wpHomeDir;
};

/**
 *
 * Must restart Nginx after created
 * @param model
 * @returns {Function}
 */
const createSite = model => async (logger = () => {}) => {
  await model.ensureUser();
  const { dbUser, dbName, dbPassword, uid } = model,
    wpHomeDir = await createHomeDir(model)(logger);

  const commands = [
    `wp core download`,
    `wp config create --dbname='${dbUser}_${dbName}' --dbuser=${dbUser} --dbpass=${dbPassword} --dbhost=${_mysqlDbHost}`,
    `wp db create`
  ];

  for (const command of commands)
    await _shellCommandAsync(command, {
      cwd: wpHomeDir,
      uid,
      ...(process.env.NODE_ENV === "production" ? { gid: uid } : {})
    })(logger);

  model.isCreated = true;
  await NginxJobs.updateConfig(model);
};

const installSite = model => async (logger = () => {}) => {
  await model.ensureUser();
  //make sure website is created
  if (!model.isCreated) await createSite(model)(logger);

  const { installMethod, installInfo, wpHomeDir, uid } = model;

  if (installMethod === "auto") {
    const params = Object.entries(installInfo).reduce(
      (acc, [key, value]) => acc + ` --${key.toSnakeCase()}='${value}'`,
      ""
    );
    await _shellCommandAsync(`wp core install ${params.trim()}`, {
      cwd: wpHomeDir,
      uid,
      ...(process.env.NODE_ENV === "production" ? { gid: uid } : {})
    })(logger);
  }
};

/**
 *
 * Must restart Nginx after updated
 * @param model
 * @returns {Function}
 */
const updateSite = model => async (logger = () => {}) => {
  await model.ensureUser();
  const { wpHomeDir, domain, uid } = model;
  if (model.ssl === true) {
    await _shellCommandAsync(
      `wp search-replace 'http://${domain}' 'https://${domain}' --skip-columns=grid`,
      {
        cwd: wpHomeDir,
        uid,
        ...(process.env.NODE_ENV === "production" ? { gid: uid } : {})
      }
    )(logger);
    await NginxJobs.updateConfig(model);
  }

  await NginxJobs.restart(logger);
};

const WordpressJobs = {
  createHomeDir,
  createSite,
  installSite,
  updateSite
};

export default WordpressJobs;
