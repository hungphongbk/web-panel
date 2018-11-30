import mongoose from "mongoose";
import path from "path";

mongoose.connect("mongodb://localhost/webPanel").then(() => {
  console.log("Completed setup WebPanel DB");
});

global.APP_TEMPLATES = path.join(__dirname, "__templates");

String.prototype.toSnakeCase = function() {
  var upperChars = this.match(/([A-Z])/g);
  if (!upperChars) {
    return this;
  }

  var str = this.toString();
  for (var i = 0, n = upperChars.length; i < n; i++) {
    str = str.replace(
      new RegExp(upperChars[i]),
      "_" + upperChars[i].toLowerCase()
    );
  }

  if (str.slice(0, 1) === "_") {
    str = str.slice(1);
  }

  return str;
};
