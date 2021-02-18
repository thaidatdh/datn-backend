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
    drug: {
      type: mongoose.Types.ObjectId,
      ref: "drug",
      required: true,
    },
    refill: String,
    dispensed: String,
    quantity: String,
    description: String,
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
