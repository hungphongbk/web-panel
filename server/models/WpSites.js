import mongoose from "mongoose";

const schema = new mongoose.Schema({
  domain: { type: String, required: true },
  dbName: { type: String, required: true },
  dbUser: { type: String, required: true },
  dbPassword: { type: String, required: true },
  nginxConfFile: { type: String, required: true },
  ssl: { type: Boolean, default: false }
});

const WpSite = mongoose.model("WpSite", schema);

export default WpSite;
