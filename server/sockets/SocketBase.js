class SocketBase {
  io = null;
  socket = null;
  static create(io, namespace) {
    io.of(namespace).on("connection", socket => new this(io, socket));
  }

  constructor(io, socket) {
    this.io = io;
    this.socket = socket;
  }
}

export default SocketBase;
