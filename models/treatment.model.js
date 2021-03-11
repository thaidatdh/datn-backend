const mongoose = require("mongoose");
require("./treatment.plan.model")
const Patient = require("./patient.model");
const Staff = require("./staff.model");
const Procedure = require("./procedure.code.model");
const Appointment = require("./appointment.model");
const TreatmentSchema = mongoose.Schema(
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
    assistant: {
      type: mongoose.Types.ObjectId,
      ref: "staff",
      required: false,
    },
    procedure_code: {
      type: mongoose.Types.ObjectId,
      ref: "procedure_code",
      required: true,
    },
    ada_code: String,
    tooth: String,
    surface: String,
    fee: Number,
    insurance_percent: Number,
    discount: Number,
    insurance_amount: Number,
    description: String,
    note: String,
    treatment_plan: {
      type: mongoose.Types.ObjectId,
      ref: "treatment_plan",
      required: false,
    },
    appointment: {
      type: mongoose.Types.ObjectId,
      ref: "appointment",
      required: false,
    },
    mark_type: String,
  },
  {
    timestamps: true,
    collection: "treatments",
  }
);

module.exports = mongoose.model("treatment", TreatmentSchema);
