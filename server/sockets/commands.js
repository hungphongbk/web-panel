import SocketBase from "./SocketBase";
import { spawn } from "child_process";
import Setting from "../models/Settings";
import { ab2str } from "../../universal/utils";
import Mustache from "mustache";
import { getTemplateFile } from "../helpers";

class SocketCommands extends SocketBase {
  constructor(io, socket) {
    super(io, socket);
    socket.on("executeRestartNginx", this.executeRestartNginx.bind(this));
    socket.on("createWordpressSite", this.createWordpressSite.bind(this));
  }

  async executeRestartNginx() {
    const { value: cmd } = await Setting.findOne({ key: "nginxRestartCmd" });
    const childProcess = spawn(cmd + " 2>&1", {
      stdio: "pipe",
      shell: true
    });
    childProcess.stdout.on("data", data => {
      this.socket.emit("logRestartNginx", { log: ab2str(data) });
    });
    childProcess.on("close", () => this.socket.emit("endLogRestartNginx"));
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
