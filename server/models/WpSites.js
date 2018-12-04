import mongoose from "mongoose";
import NginxJobs from "../jobs/Nginx";
import { _uid } from "../jobs/shell";

const schema = new mongoose.Schema({
  domain: { type: String, required: true },
  dbName: { type: String, required: true },
  dbUser: { type: String, required: true },
  dbPassword: { type: String, required: true },
  nginxConfFile: { type: String, required: true },
  ssl: { type: Boolean, default: false },
  wpHomeDir: { type: String },
  isCreated: { type: Boolean, default: false },
  isInstalled: { type: Boolean, default: false },
  installMethod: { type: String, required: true },
  installInfo: { type: Object, default: () => ({}) },
  uid: { type: Number, default: -1 }
});

schema.methods.ensureUser = async function() {
  if (!this.uid) {
    this.uid = await _uid(this.dbUser);
  }

  await this.save();
};

const WpSite = mongoose.model("WpSite", schema);

export default WpSite;
