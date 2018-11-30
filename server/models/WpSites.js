import mongoose from "mongoose";
import NginxJobs from "../jobs/Nginx";

const schema = new mongoose.Schema({
  domain: { type: String, required: true },
  dbName: { type: String, required: true },
  dbUser: { type: String, required: true },
  dbPassword: { type: String, required: true },
  nginxConfFile: { type: String, required: true },
  ssl: { type: Boolean, default: false },
  isCreated: { type: Boolean, default: false }
});

schema.methods.saveWithTriggers = async function(logger = () => {}) {
  const { isCreated, ssl } = this;

  if (isCreated && ssl) {
  }

  NginxJobs.updateConfig(this.toJSON());
  await NginxJobs.restart(logger);

  this.isCreated = true;
  await this.save();
  return this;
};

const WpSite = mongoose.model("WpSite", schema);

export default WpSite;
