const mongoose = require("mongoose");

const InsurerSchema = mongoose.Schema(
  {
    name: String,
    address: String,
    phone: String,
    fax: String,
    email: String,
    max_coverage: Number,
  },
  {
    timestamps: true,
    collection: "insurers",
  }
);

const InsurerModel = (module.exports = mongoose.model(
  "insurer",
  InsurerSchema
));
module.exports.insert = async function (insurerInfo) {
  let insurer = new InsurerModel();
  insurer.name = insurerInfo.name ? insurerInfo.name : null;
  insurer.address = insurerInfo.address ? insurerInfo.address : null;
  insurer.phone = insurerInfo.phone ? insurerInfo.phone : null;
  insurer.fax = insurerInfo.fax ? insurerInfo.fax : null;
  insurer.email = insurerInfo.email ? insurerInfo.email : null;
  insurer.max_coverage = insurerInfo.max_coverage
    ? insurerInfo.max_coverage
    : 0;
  return insurer.save();
};
