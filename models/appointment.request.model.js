const mongoose = require("mongoose");
const constants = require("../constants/constants");
const Patient = require("./patient.model");
const AppointmentRequestSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Types.ObjectId,
      ref: "patient",
      required: false,
    },
    request_date: Date,
    first_name: String,
    last_name: String,
    address: String,
    email: String,
    phone: String,
    note: String,
    availability: String,
    is_new_patient: Boolean,
  },
  {
    timestamps: true,
    collection: "appointment_request",
  }
);

module.exports = mongoose.model(
  "appointment_request",
  AppointmentRequestSchema
);
