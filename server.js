"use strict";

// Generate webpack config with CLI service
import webpackConfig from "@vue/cli-service/webpack.config.js";
// Create express app
import express from "express";
import bodyParser from "body-parser";
import "./server/bootstrap";
import settings from "./server/routes/settings";
const app = express();
import webpack from "webpack";
import devMiddleware from "webpack-dev-middleware"; // eslint-disable-line

import hotMiddleware from "webpack-hot-middleware"; // eslint-disable-line

// Configure webpack as middleware
if (process.env.NODE_ENV === "development") {
  webpackConfig.entry.app.unshift("webpack-hot-middleware/client");
  const compiler = webpack(webpackConfig);
  app.use(
    devMiddleware(compiler, {
      noInfo: false,
      publicPath: webpackConfig.output.publicPath,
      headers: { "Access-Control-Allow-Origin": "*" },
      stats: { colors: true }
    })
  );
  app.use(
    hotMiddleware(compiler, {
      log: console.log
    })
  );
}
app.use(bodyParser.json());
app.use("/settings", settings);
if (process.env.NODE_ENV === "production") {
  app.use("/", express.static("dist"));
}

const port = process.env.PORT || 8080,
  host = process.env.HOST || "localhost";
app.listen(port, host, function() {
  console.log(
    `${process.env.NODE_ENV} server running on http://${host}:${port}`
  );
});
