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

module.exports = mongoose.model("referral", UserSchema);
