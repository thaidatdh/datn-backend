const mongoose = require("mongoose");

const ReferralSourceSchema = mongoose.Schema(
  {
    name: String,
    address: String,
    phone: String,
    fax: String,
    email: String,
    additional_info: String,
  },
  {
    timestamps: true,
    collection: "referral_source",
  }
);

const ReferralSourceModel = (module.exports = mongoose.model(
  "referral_source",
  ReferralSourceSchema
));

module.exports.insert = async function (sourceInfo) {
  let source = new ReferralSourceModel();
  source.name = sourceInfo.name ? sourceInfo.name : null;
  source.address = sourceInfo.address ? sourceInfo.address : null;
  source.phone = sourceInfo.phone ? sourceInfo.phone : null;
  source.fax = sourceInfo.fax ? sourceInfo.fax : null;
  source.email = sourceInfo.email ? sourceInfo.email : null;
  source.additional_info = sourceInfo.additional_info
    ? sourceInfo.additional_info
    : null;
  return await source.save();
};
module.exports.updateSource = async function (source, sourceInfo) {
  source.name = sourceInfo.name ? sourceInfo.name : source.name;
  source.address = sourceInfo.address ? sourceInfo.address : source.address;
  source.phone = sourceInfo.phone ? sourceInfo.phone : source.phone;
  source.fax = sourceInfo.fax ? sourceInfo.fax : source.fax;
  source.email = sourceInfo.email ? sourceInfo.email : source.email;
  source.additional_info = sourceInfo.additional_info
    ? sourceInfo.additional_info
    : source.additional_info;
  return await source.save();
};
