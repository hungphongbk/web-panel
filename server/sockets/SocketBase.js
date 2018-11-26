class SocketBase {
  io = null;
  socket = null;
  channel = null;
  static create(io, channel) {
    io.on("connection", socket => new this(io, socket, channel));
  }

  constructor(io, socket, channel) {
    this.io = io;
    this.socket = socket;
    this.channel = channel;

    socket.join(channel);
  }
}

export default SocketBase;
