const path = require("path");

require("@babel/register")({
  ignore: [/node_modules/],
  cache: true,
  configFile: path.resolve(__dirname, ".babelrc")
});
require("./server/index.js");
