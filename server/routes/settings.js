import { Router } from "express";
import Setting from "../models/Settings";

const settings = new Router();

settings.get("/", (req, res) => {
  Setting.find({}).then(settings => res.json(settings));
});
settings.post("/:key", (req, res) => {
  Setting.findOneOrCreate({ key: req.params.key }, {}, (err, setting) => {
    if (err) console.error(err);
    else {
      const { value } = req.body;
      setting.value = value;
      setting.save().then(() => res.json({}));
    }
  });
});

export default settings;
