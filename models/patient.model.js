const mongoose = require("mongoose");

const PatientSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    patient_id: String,
    active_date: Date,
    is_active: Boolean,
    head_of_household: {
      type: mongoose.Types.ObjectId,
      ref: "patient",
    },
    patient_type: String, //PATIENT/NON-PATIENT
    new_patient: Boolean, //is new patient
    medical_alert: String,
    patient_note: String,
    marital_status: { type: String, default: "NOT_SPECIFY" }, //MARRIED, DIVORCED, SINGLE, NOT_SPECIFY
    dob: String,
    other_info: String,
    provider: {
      type: mongoose.Types.ObjectId,
    },
    email_recall: Boolean,
    appt_reminder: Boolean,
    gender: {
      type: String,
      default: "NOT_SPECIFY", //MALE, FEMALE, NOT_SPECIFY
    },
    patient_photo: String,
  },
  {
    timestamps: true,
    collection: "patients",
  }
);

module.exports = mongoose.model("patient", PatientSchema);
