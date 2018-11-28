import SocketBase from "./SocketBase";
import { spawn } from "child_process";
import Setting from "../models/Settings";
import { ab2str } from "../../universal/utils";

class SocketCommands extends SocketBase {
  constructor(io, socket) {
    super(io, socket);
    socket.on("executeRestartNginx", this.executeRestartNginx.bind(this));
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

  async createWordpressSite({ domain, dbUser, dbPassword, dbName }) {}
}

export default SocketCommands;
