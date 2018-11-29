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
  constructor(io, socket) {
    super(io, socket);
    socket.on("executeRestartNginx", this.executeRestartNginx.bind(this));
    socket.on("createWordpressSite", this.createWordpressSite.bind(this));
  }

  @executeCommand
  async executeRestartNginx(logger) {
    const { value: cmd } = await Setting.findOne({ key: "nginxRestartCmd" });
    await new Promise(resolve => {
      console.log("execute");
      const childProcess = spawn(cmd + " 2>&1", {
        stdio: "pipe",
        shell: true
      });
      childProcess.stdout.on("data", data => {
        logger({ log: ab2str(data) });
      });
      childProcess.on("close", resolve);
    });
  }

  async createWordpressSite({ domain, dbUser, dbPassword, dbName }) {
    // construct nginx config
    const nginxConfig = Mustache.render(
      getTemplateFile("wordpress-nginx.conf.mustache"),
      { domain, ssl: false }
    );
    this.socket.emit("createWordpressSiteLog", { nginxConfig });
  }
}

export default SocketCommands;
