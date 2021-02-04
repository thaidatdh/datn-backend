const mongoose = require('mongoose');
const Patient = require("./patient.model");
const Treatment = require("./treatment.model");
const Appointment = require("./appointment.model");
const Procedure = require("./procedure.code.model");
const RecallSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Types.ObjectId,
      ref: "patient",
      required: true,
    },
    treatment: {
      type: mongoose.Types.ObjectId,
      ref: "treatment",
      required: false,
    },
    appointment: {
      type: mongoose.Types.ObjectId,
      ref: "appointment",
      required: false,
    },
    procedure: {
      type: mongoose.Types.ObjectId,
      ref: "procedure_code",
      required: false,
    },
    interval: String,
    recall_date: Date,
    is_active: Boolean,
    note: String,
  },
  {
    timestamps: true,
    collection: "recalls",
  }
);

module.exports = mongoose.model('recall', RecallSchema);