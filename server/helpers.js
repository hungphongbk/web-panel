import fs from "fs";
import path from "path";

export function getTemplateFile(filename) {
  return fs.readFileSync(path.join(global.APP_TEMPLATES, filename), "utf-8").trim();
}