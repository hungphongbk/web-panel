import mongoose from "mongoose";

mongoose.connect("mongodb://localhost/webPanel").then(() => {
  console.log("Completed setup WebPanel DB");
});
