const mongoose = require("mongoose");
const Prescription = require("./prescription.model");
const PrescriptionDetailSchema = mongoose.Schema(
  {
    prescription: {
      type: mongoose.Types.ObjectId,
      ref: "prescription",
      required: true,
    },
    is_deleted: Boolean,
    status: String,
    dispense: {
      type: mongoose.Types.ObjectId,
      ref: "dispense",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "prescription_detail",
  }
);
module.exports = mongoose.model(
  "prescription_detail",
  PrescriptionDetailSchema
);
