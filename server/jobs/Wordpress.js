import { _homeDir, _mkDir, _shellCommandAsync, _uid } from "./shell";
import path from "path";

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
};

const installSite = model => async (logger = () => {}) => {
  await model.ensureUser();
  //make sure website is created
  if (!model.isCreated) await createSite(model)(logger);

  const { installMethod, installInfo, wpHomeDir, dbName, uid } = model;

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

const updateSite = obj => async (logger = () => {}) => {};

const WordpressJobs = {
  createHomeDir,
  createSite,
  installSite,
  updateSite
};

export default WordpressJobs;
