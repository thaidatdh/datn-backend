const mongoose = require('mongoose');
const Patient = require("./patient.model");
const Staff = require("./staff.model");
const PrescriptionDetail = require("./prescription.detail.model");
const PrescriptionSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Types.ObjectId,
      ref: "patient",
      required: true,
    },
    provider: {
      type: mongoose.Types.ObjectId,
      ref: "staff",
      required: true,
    },
    prescription_date: Date,
  },
  {
    timestamps: true,
    collection: "prescription",
  }
);
PrescriptionSchema.virtual("prescription_detail", {
  ref: "prescription_detail",
  localField: "_id",
  foreignField: "prescription",
  justOne: false,
});
module.exports = mongoose.model("prescription", PrescriptionSchema);