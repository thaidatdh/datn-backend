const mongoose = require('mongoose');
const Patient = require("./patient.model");
const Insurer = require("./insurer.model");
const PatientInsuranceSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Types.ObjectId,
      ref: "patient",
      required: true,
    },
    insurer: {
      type: mongoose.Types.ObjectId,
      ref: "insurer",
      required: true,
    },
    start_date: Date,
    reset_date: Date,
  },
  {
    timestamps: true,
    collection: "patient_insurance",
  }
);

module.exports = mongoose.model('patient_insurance', PatientInsuranceSchema);