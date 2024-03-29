const mongoose = require("mongoose");
const constants = require("../constants/constants");
const { formatPhone } = require("../utils/utils");
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
ReferralSourceSchema.set("toJSON", { virtuals: true });
ReferralSourceSchema.set("toObject", { virtuals: true });

const ReferralSourceModel = (module.exports = mongoose.model(
  "referral_source",
  ReferralSourceSchema
));

module.exports.insert = async function (sourceInfo) {
  let source = new ReferralSourceModel();
  source.name = sourceInfo.name ? sourceInfo.name : null;
  source.address = sourceInfo.address ? sourceInfo.address : null;
  source.phone = sourceInfo.phone ? formatPhone(sourceInfo.phone) : null;
  source.fax = sourceInfo.fax ? formatPhone(sourceInfo.fax) : null;
  source.email = sourceInfo.email ? sourceInfo.email : null;
  source.additional_info = sourceInfo.additional_info
    ? sourceInfo.additional_info
    : null;
  return await source.save();
};
module.exports.updateSource = async function (source, sourceInfo) {
  source.name = sourceInfo.name !== undefined ? sourceInfo.name : source.name;
  source.address =
    sourceInfo.address !== undefined ? sourceInfo.address : source.address;
  source.phone =
    sourceInfo.phone != undefined ? formatPhone(sourceInfo.phone) : source.phone;
  source.fax = sourceInfo.fax !== undefined ? formatPhone(sourceInfo.fax) : source.fax;
  source.email =
    sourceInfo.email !== undefined ? sourceInfo.email : source.email;
  source.additional_info =
    sourceInfo.additional_info !== undefined
      ? sourceInfo.additional_info
      : source.additional_info;
  return await source.save();
};
module.exports.get = async function (query, populateOptions) {
  populateOptions = populateOptions || {};
  const promise = ReferralSourceModel.find(query);
  // Limit
  if (populateOptions.limit && populateOptions.page) {
    promise.skip(
      Number.parseInt(populateOptions.limit) *
        Number.parseInt(populateOptions.page)
    );
  }
  if (populateOptions.limit) {
    promise.limit(Number.parseInt(populateOptions.limit));
  }
  const resultQuery = await promise.exec();
  return resultQuery;
};
