import Mustache from "mustache";
import { getTemplateFile } from "../helpers";
import fs from "fs";
import Setting from "../models/Settings";
import { _shellCommandAsync } from "./shell";

function updateConfig(obj, template = "wordpress-nginx.conf.mustache") {
  const nginxConfigContent = Mustache.render(getTemplateFile(template), obj);
  fs.writeFileSync(obj.nginxConfFile, nginxConfigContent);
}

async function restart(logger) {
  const { value: cmd } = await Setting.findOne({ key: "nginxRestartCmd" });
  await _shellCommandAsync(cmd)(logger);
}

const NginxJobs = {
  updateConfig,
  restart
};
export default NginxJobs;
