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

module.exports = mongoose.model("referral_source", ReferralSourceSchema);
