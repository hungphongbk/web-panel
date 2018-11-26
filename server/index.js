"use strict";

// Generate webpack config with CLI service
// import webpackConfig from "@vue/cli-service/webpack.config.js";
// Create express app
import express from "express";
import bodyParser from "body-parser";
import "./bootstrap";
import settings from "./routes/settings";
import { Server } from "http";
import SocketIO from "socket.io";
import SocketCommands from "./sockets/commands";

const app = express(),
  _app = new Server(app),
  io = SocketIO(_app);
// import webpack from "webpack";
import vhost from "vhost";
// import devMiddleware from "webpack-dev-middleware";
// import hotMiddleware from "webpack-hot-middleware";

const port = process.env.PORT || 8081,
  host = process.env.HOST || "localhost";

// Configure webpack as middleware
// if (process.env.NODE_ENV === "development") {
//   webpackConfig.entry.app.unshift("webpack-hot-middleware/client");
//   const compiler = webpack(webpackConfig);
//   app.use(
//     devMiddleware(compiler, {
//       noInfo: false,
//       publicPath: webpackConfig.output.publicPath,
//       headers: { "Access-Control-Allow-Origin": "*" },
//       stats: { colors: true }
//     })
//   );
//   app.use(
//     hotMiddleware(compiler, {
//       log: console.log
//     })
//   );
// }
app.use(bodyParser.json());
app.use("/api/settings", settings);
if (process.env.NODE_ENV === "production") {
  app.use("/", express.static("dist"));
}

// SET-UP SOCKET IO
SocketCommands.create(io, "commands");

const genericApp = express();
genericApp.use(vhost(host, app));

// TODO
_app.listen(port, function() {
  console.log(
    `${process.env.NODE_ENV} server running on http://${host}:${port}`
  );
});
