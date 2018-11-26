import SocketBase from "./SocketBase";
import { spawn } from "child_process";
import Setting from "../models/Settings";

class SocketCommands extends SocketBase {
  constructor(io, socket) {
    super(io, socket);
    socket.on("executeRestartNginx", this.restartNginx.bind(this));
  }

  async restartNginx() {
    const { value: cmd } = await Setting.findOne({ key: "nginxRestartCmd" });
    const childProcess = spawn(cmd + " 2>&1", {
      stdio: "inherit",
      shell: true
    });
    childProcess.unref();
    childProcess.on("message", data =>
      this.socket.emit("logRestartNginx", { log: data })
    );
    childProcess.on("close", () => this.socket.emit("endLogRestartNginx"));
  }
}

export default SocketCommands;
