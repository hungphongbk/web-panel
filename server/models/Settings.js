import mongoose from "mongoose";

const schema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed, default: () => null }
});

schema.statics.findOneOrCreate = function findOneOrCreate(
  condition,
  doc = {},
  callback
) {
  const self = this;
  self.findOne(condition, (err, result) => {
    return result
      ? callback(err, result)
      : self.create(Object.assign({}, condition, doc), (err, result) => {
          return callback(err, result);
        });
  });
};

const Setting = mongoose.model("Setting", schema);

export default Setting;
