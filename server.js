require("@babel/register")({
  ignore: [/node_modules/],
  cache: true
});
require("./server/index.js");
