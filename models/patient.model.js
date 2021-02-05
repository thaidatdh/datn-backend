const mongoose = require("mongoose");
const constants = require("../constants/constants");
require("./staff.model");
const User = require("./user.model");
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
      ref: 'staff',
    },
    email_recall: Boolean,
    appt_reminder: Boolean,
    gender: {
      type: String,
      default: "NOT_SPECIFY", //MALE, FEMALE, NOT_SPECIFY
    },
    patient_photo: String,
    patient_balance: Number,
    insurance_balance: Number,
    credit_amount: Number,
  },
  {
    timestamps: true,
    collection: "patients",
  }
);

const PatientModel = (module.exports = mongoose.model(
  "patient",
  PatientSchema
));
module.exports.insert = async function (patientInfo) {
  patientInfo.user_type = constants.USER.USER_TYPE_PATIENT;
  const insertedUser = await User.insert(patientInfo);
  const user_id = insertedUser._id;
  let patient = new PatientModel();
  patient.user = user_id;
  patient.patient_id = patientInfo.patient_id
    ? patientInfo.patient_id
    : null;
  patient.active_date = patientInfo.active_date
    ? patientInfo.active_date
    : Date.now();
  patient.is_active =
    patientInfo.is_active != undefined
      ? patientInfo.is_active
      : constants.PATIENT.DEFAULT_IS_ACTIVE;
  patient.head_of_household = patientInfo.head_of_household
    ? patientInfo.head_of_household
    : null;
  patient.patient_type = patientInfo.patient_type
    ? patientInfo.patient_type
    : patient.patient_type;
  patient.new_patient = patientInfo.new_patient
    ? patientInfo.new_patient
    : constants.PATIENT.DEFAULT_IS_NEW_PATIENT;
  patient.medical_alert = patientInfo.medical_alert
    ? patientInfo.medical_alert
    : null;
  patient.patient_note = patientInfo.patient_note
    ? patientInfo.patient_note
    : null;
  patient.marital_status = patientInfo.marital_status
    ? patientInfo.marital_status
    : constants.PATIENT.DEFAULT_MARIRAL_STATUS;
  patient.dob = patientInfo.dob ? patientInfo.dob : patient.dob;
  patient.other_info = patientInfo.other_info
    ? patientInfo.other_info
    : null;
  patient.provider = patientInfo.provider
    ? patientInfo.provider
    : null;
  patient.email_recall =
    patientInfo.email_recall != undefined
      ? patientInfo.email_recall
      : constants.PATIENT.DEFAULT_EMAIL_RECALL;
  patient.appt_reminder =
    patientInfo.appt_reminder != undefined
      ? patientInfo.appt_reminder
      : constants.PATIENT.DEFAULT_APPT_REMINDER;
  patient.gender = patientInfo.gender ? patientInfo.gender : constants.DEFAULT_GENDER;
  patient.patient_photo = patientInfo.patient_photo
    ? patientInfo.patient_photo
    : constants.PATIENT.DEFAULT_PATIENT_PHOTO_LINK;
  patient.patient_balance = 0.0;
  patient.insurance_balance = 0.0;
  patient.credit_amount = 0.0;
  const insertedPatient = await patient.save();
  return await Object.assign({}, insertedUser._doc, insertedPatient._doc);
};

module.exports.get = async function (query, populateOptions) {
  populateOptions = populateOptions || {};
  const promise = PatientModel.find(query);
  promise.populate("user");
  // Limit
  if (populateOptions.limit) {
    promise.limit(limit);
  }
  if (populateOptions.get_hohh) {
    promise.populate({
      path: "head_of_household",
      populate: {
        path: "user",
      },
    });
  }
  if (populateOptions.get_provider) {
    promise.populate({
      path: "provider",
      populate: {
        path: "user",
      },
    });
  }
  const resultQuery = await promise.exec();
  return resultQuery;
};
