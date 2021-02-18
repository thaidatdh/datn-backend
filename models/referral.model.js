const mongoose = require("mongoose");
const Patient = require("./patient.model");
const Staff = require("./staff.model");
const ReferralSource = require("./referral.source.model");
const UserSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Types.ObjectId,
      ref: "patient",
    },
    ref_patient: {
      type: mongoose.Types.ObjectId,
      ref: "patient",
    },
    referral_source: {
      type: mongoose.Types.ObjectId,
      ref: "referral_source",
    },
    ref_staff: {
      type: mongoose.Types.ObjectId,
      ref: "staff",
    },
    referral_type: String,
    referral_date: Date,
  },
  {
    timestamps: true,
    collection: "referral",
  }
);

const ReferralModel = (module.exports = mongoose.model("referral", UserSchema));
module.exports.get = async function (query, populateOptions) {
  populateOptions = populateOptions || {};
  const promise = ReferralModel.find(query);
  promise.populate("user");
  // Limit
  if (populateOptions.limit) {
    promise.limit(limit);
  }
  if (populateOptions.get_patient) {
    promise.populate("patient");
  }
  if (populateOptions.get_staff) {
    promise.populate("staff");
  }
  if (populateOptions.get_source) {
    promise.populate("referral_source");
  }
  const resultQuery = await promise.exec();
  return resultQuery;
};
