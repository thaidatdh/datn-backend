const mongoose = require("mongoose");
const Patient = require("./patient.model");
const Staff = require("./staff.model");
const ReferralSource = require("./referral.source.model");
const ReferralSchema = mongoose.Schema(
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

const ReferralModel = (module.exports = mongoose.model("referral", ReferralSchema));
module.exports.get = async function (query, populateOptions) {
  populateOptions = populateOptions || {};
  const promise = ReferralModel.find(query);
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
module.exports.insert = async function (referralinfo) {
  let referral = new ReferralModel();
  referral.referral_date = referralinfo.referral_date
    ? Date.parse(referralinfo.referral_date)
    : Date.now();
  referral.patient = referralinfo.patient ? referralinfo.patient : null;
  referral.ref_patient = referralinfo.ref_patient
    ? referralinfo.ref_patient
    : null;
  referral.referral_source = referralinfo.referral_source
    ? referralinfo.referral_source
    : null;
  referral.ref_staff = referralinfo.ref_staff ? referralinfo.ref_staff : null;
  referral.referral_type = referralinfo.referral_type
    ? referralinfo.referral_type
    : "TO";
  return await referral.save();
};
module.exports.updateReferral = async function (referral, referralinfo) {
  referral.referral_date = referralinfo.referral_date
    ? Date.parse(referralinfo.referral_date)
    : referral.referral_date;
  referral.patient =
    referralinfo.patient !== undefined
      ? referralinfo.patient
      : referral.patient;
  referral.ref_patient =
    referralinfo.ref_patient !== undefined
      ? referralinfo.ref_patient
      : referral.ref_patient;
  referral.referral_source =
    referralinfo.referral_source !== undefined
      ? referralinfo.referral_source
      : referral.referral_source;
  referral.ref_staff =
    referralinfo.ref_staff !== undefined
      ? referralinfo.ref_staff
      : referral.ref_staff;
  referral.referral_type = referralinfo.referral_type
    ? referralinfo.referral_type
    : referral.referral_type;
  return await referral.save();
};