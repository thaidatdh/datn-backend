const mongoose = require("mongoose");

const StaffSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    display_id: String,
    is_active: Boolean,
    provider_color: {
      type: String,
      default: "#FFFFFF",
    },
    staff_type: {
      type: String,
      default: "STAFF", //STAFF, PROVIDER
    },
    drug_lic: String,
    specialist: {
      type: mongoose.Types.ObjectId,
      ref: "specialist",
    },
    access_group_id: {
      type: mongoose.Types.ObjectId,
      ref: "access_group",
    },
    start_date: Date,
    npi: String,
  },
  {
    timestamps: true,
    collection: "staffs",
  }
);

module.exports = mongoose.model("staff", StaffSchema);
