import SocketBase from "./SocketBase";
import { spawn } from "child_process";
import Setting from "../models/Settings";

class SocketCommands extends SocketBase {
  constructor(io, socket) {
    super(io, socket);
    socket.on("execute:restartNginx", this.restartNginx.bind(this));
  }

  async restartNginx() {
    const { value: cmd } = await Setting.findOne({ key: "nginxRestartCmd" });
    const childProcess = spawn(cmd + " 2>&1", {
      stdio: "inherit",
      shell: true
    });
    childProcess.unref();
    childProcess.stdout.on("data", data =>
      this.socket.emit("log:restartNginx", { log: data })
    );
    childProcess.on("close", () => this.socket.emit("endLog:restartNginx"));
  }
}

export default SocketCommands;
