import mongoose from "mongoose";
import path from "path";

mongoose.connect("mongodb://localhost/webPanel").then(() => {
  console.log("Completed setup WebPanel DB");
});

global.APP_TEMPLATES = path.join(__dirname, "__templates");
