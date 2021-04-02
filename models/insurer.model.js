const mongoose = require("mongoose");
const constants = require("../constants/constants");

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
  return await insurer.save();
};
module.exports.updateInsurer = async function (insurer, insurerInfo) {
  insurer.name =
    insurerInfo.name !== undefined ? insurerInfo.name : insurer.name;
  insurer.address =
    insurerInfo.address !== undefined ? insurerInfo.address : insurer.address;
  insurer.phone =
    insurerInfo.phone !== undefined ? insurerInfo.phone : insurer.phone;
  insurer.fax = insurerInfo.fax !== undefined ? insurerInfo.fax : insurer.fax;
  insurer.email =
    insurerInfo.email !== undefined ? insurerInfo.email : insurer.email;
  insurer.max_coverage = insurerInfo.max_coverage
    ? insurerInfo.max_coverage
    : insurer.max_coverage;
  return await insurer.save();
};
