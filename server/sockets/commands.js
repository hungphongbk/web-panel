import path from "path";
import fs from "fs";
import reverseMustache from "reverse-mustache";

import SocketBase from "./SocketBase";
import { spawn } from "child_process";
import Setting from "../models/Settings";
import { ab2str } from "../../universal/utils";
import Mustache from "mustache";
import { getTemplateFile } from "../helpers";
import {
  SOCKET_EVENT_TERMINAL_CLOSE,
  SOCKET_EVENT_TERMINAL_LOG,
  SOCKET_EVENT_TERMINAL_OPEN
} from "../../universal/consts";
import WpSite from "../models/WpSites";

const executeCommand = (target, prop, descriptor) => {
  let { value: fn } = descriptor;
  descriptor.value = function() {
    this.socket.emit(SOCKET_EVENT_TERMINAL_OPEN, prop);
    const logger = log => {
      if (process.env.NODE_ENV === "development") console.log(log);
      this.socket.emit(SOCKET_EVENT_TERMINAL_LOG, {
        eventName: prop,
        ...log
      });
    };
    fn.apply(this, [logger, ...arguments]).then(() => {
      this.socket.emit(SOCKET_EVENT_TERMINAL_CLOSE, prop);
    });
  };
  return descriptor;
};

class SocketCommands extends SocketBase {
  _mysqlDbHost =
    process.env.NODE_ENV === "development" ? "188.166.177.127" : "localhost";

  constructor(io, socket) {
    super(io, socket);
    ["executeRestartNginx", "createWordpressSite", "checkDomain"].forEach(
      methodName => socket.on(methodName, this[methodName].bind(this))
    );
  }

  /**
   * Get UID of specific user
   *
   * @param username
   * @returns {Promise<number>}
   * @private
   */
  _uid(username) {
    let uid = "";
    return this._shellCommand(`id -u ${username}`, data => (uid = data))().then(
      () => uid.trim() * 1
    );
  }

  /**
   * Get Home Directory of user with specific UID
   * @param uid
   * @returns {Promise<string>}
   * @private
   */
  _homeDir(uid = undefined) {
    let homeDir = "";
    return this._shellCommand(
      "echo $HOME",
      data => {
        homeDir = data;
      },
      uid ? { uid } : {}
    )().then(() => homeDir.trim());
  }

  _shellCommand(cmd, onData = () => {}, _processOpts = {}) {
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

  _shellCommandAsync(cmd, _processOpts = {}) {
    return async logger => {
      let data = "";
      await this._shellCommand(cmd, d => (data = d), _processOpts)(logger);
      return data;
    };
  }

  @executeCommand
  async executeRestartNginx(logger) {
    const { value: cmd } = await Setting.findOne({ key: "nginxRestartCmd" });
    await new Promise(resolve => {
      const childProcess = spawn(cmd + " 2>&1", {
        stdio: "pipe",
        shell: true
      });
      childProcess.stdout.on("data", data => {
        logger({ log: data });
      });
      childProcess.on("close", resolve);
    });
  }

  @executeCommand
  async createWordpressSite(logger, { domain, dbUser, dbPassword, dbName }) {
    const uid = await this._uid(dbUser);
    console.log(`${dbUser} has uid = ${uid}`);
    console.log(`Path of wp is`);
    console.log(await this._shellCommandAsync("which wp", { uid }));

    // construct nginx config
    const wpSite = new WpSite({ domain, dbName, dbUser, dbPassword });
    const { value: nginxConfDir } = await Setting.findOne({
      key: "nginxConfDir"
    });
    //generate nginx conf path
    wpSite.nginxConfFile = path.join(nginxConfDir, `${dbName}.conf`);
    await wpSite.save();
    const nginxConfigContent = Mustache.render(
      getTemplateFile("wordpress-nginx.conf.mustache"),
      wpSite.toJSON()
    );

    // write nginx config into
    fs.writeFileSync(wpSite.nginxConfFile, nginxConfigContent);

    // scaffold wordpress folder
    // 1. Create folder
    const homeDir = await this._homeDir(uid),
      wpHomeDir = path.join(homeDir, "www", domain);

    // NOTE - for testing only, remove wpHomeDir if exists
    if (process.env.NODE_ENV === "development" && fs.existsSync(wpHomeDir))
      await this._shellCommand(`rm -rf ${wpHomeDir}`, () => {}, { uid })(
        logger
      );
    await this._shellCommand(
      `mkdir -p ${wpHomeDir}; chmod ${wpHomeDir} 644`,
      () => {},
      { uid }
    )(logger);

    // 2. Execute wp commands (with dbUser permission)
    const commands = [
      `wp core download`,
      `wp config create --dbname='${dbUser}_${dbName}' --dbuser=${dbUser} --dbpass=${dbPassword} --dbhost=${
        this._mysqlDbHost
      }`,
      `wp db create`
    ];
    for (const command of commands) {
      await this._shellCommand(command, log => logger({ log }), {
        cwd: wpHomeDir,
        uid
      })(logger);
    }
  }

  async checkDomain({ domain }) {
    let content = "",
      template = getTemplateFile("nslookup.mustache");
    await this._shellCommand(
      `nslookup ${domain} 8.8.8.8`,
      data => (content += data)
    )();
    content = content.trim();

    const parsedData = reverseMustache({
      template,
      content
    });
    this.socket.emit("checkDomainResponse", parsedData);
  }
}

export default SocketCommands;
