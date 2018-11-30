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
import WordpressJobs from "../jobs/Wordpress";
import NginxJobs from "../jobs/Nginx";

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
   * @returns {Promise<string>}
   * @private
   * @param {string} username
   */
  _homeDir(username) {
    let homeDir = "";
    return this._shellCommand(`eval echo "~${username}"`, data => {
      homeDir = data;
    })().then(() => homeDir.trim());
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
  async createWordpressSite(
    logger,
    { domain, dbUser, dbPassword, dbName, installMethod, installInfo }
  ) {
    const uid = await this._uid(dbUser);
    console.log(`${dbUser} has uid = ${uid}`);

    // generate Nginx Config
    const wpSite = new WpSite({
      domain,
      dbName,
      dbUser,
      dbPassword,
      installMethod,
      installInfo
    });
    await NginxJobs.updateConfig(wpSite);

    // scaffold wordpress folder
    // 1. Create folder
    const wpHomeDir = await WordpressJobs.createHomeDir(wpSite)(logger);

    // 2. Execute wp commands (with dbUser permission)
    const commands = [
      `wp core download`,
      `wp config create --dbname='${dbUser}_${dbName}' --dbuser=${dbUser} --dbpass=${dbPassword} --dbhost=${
        this._mysqlDbHost
      }`,
      `wp db create`
    ];
    if (installMethod === "auto") {
      const params = Object.entries(installInfo).reduce(
        (acc, [key, value]) => acc + ` --${key.toSnakeCase()}='${value}'`,
        ""
      );
      commands.push("wp core install " + params.trim());
    }
    for (const command of commands) {
      await this._shellCommand(command, log => logger({ log }), {
        cwd: wpHomeDir,
        uid,
        ...(process.env.NODE_ENV === "production" ? { gid: uid } : {})
      })(logger);
    }

    await wpSite.saveWithTriggers(logger);
  }

  async checkDomain({ domain }) {
    let template = getTemplateFile("nslookup.mustache"),
      content = await this._shellCommandAsync(`nslookup ${domain} 8.8.8.8`)();
    content = content.trim();
    console.log(content);

    const parsedData = reverseMustache({
      template,
      content
    });
    console.log(parsedData);
    this.socket.emit("checkDomainResponse", parsedData);
  }
}

export default SocketCommands;
