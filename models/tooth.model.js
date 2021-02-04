const mongoose = require("mongoose");
const Patient = require("./patient.model");
const ToothSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Types.ObjectId,
      ref: "patient",
      required: true,
    },
    tooth_number: Number,
    tooth_note: String,
    tooth_type: {
      type: String,
      default: "ADULT",
    },
  },
  {
    timestamps: true,
    collection: "tooth",
  }
);

module.exports = mongoose.model("tooth", ToothSchema);
