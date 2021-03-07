const mongoose = require("mongoose");
const constants = require("../constants/constants");
require("./staff.model");
const User = require("./user.model");
const ToothModel = require("./tooth.model");
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
    dob: Date,
    other_info: String,
    provider: {
      type: mongoose.Types.ObjectId,
      ref: "staff",
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
function calculateAge(birthday) {
  if (birthday == null || birthday == undefined) {
    return 20;
  }
  var ageDifMs = Date.now() - birthday;
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}
module.exports.insert = async function (patientInfo) {
  patientInfo.user_type = constants.USER.USER_TYPE_PATIENT;
  const insertedUser = await User.insert(patientInfo);
  const user_id = insertedUser._id;
  let patient = new PatientModel();
  patient.user = user_id;
  patient.patient_id = patientInfo.patient_id ? patientInfo.patient_id : null;
  patient.active_date = patientInfo.active_date
    ? Date.parse(patientInfo.active_date)
    : Date.now();
  patient.is_active =
    patientInfo.is_active != undefined
      ? patientInfo.is_active
      : constants.PATIENT.DEFAULT_IS_ACTIVE;
  patient.head_of_household = patientInfo.head_of_household
    ? mongoose.Types.ObjectId(patientInfo.head_of_household)
    : null;
  patient.patient_type = patientInfo.patient_type
    ? patientInfo.patient_type
    : patient.patient_type;
  patient.new_patient =
    patientInfo.new_patient != undefined
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
  patient.dob = patientInfo.dob ? Date.parse(patientInfo.dob) : null;
  patient.other_info = patientInfo.other_info ? patientInfo.other_info : null;
  patient.provider = patientInfo.provider
    ? mongoose.Types.ObjectId(patientInfo.provider)
    : null;
  patient.email_recall =
    patientInfo.email_recall != undefined
      ? patientInfo.email_recall
      : constants.PATIENT.DEFAULT_EMAIL_RECALL;
  patient.appt_reminder =
    patientInfo.appt_reminder != undefined
      ? patientInfo.appt_reminder
      : constants.PATIENT.DEFAULT_APPT_REMINDER;
  patient.gender = patientInfo.gender
    ? patientInfo.gender
    : constants.DEFAULT_GENDER;
  patient.patient_photo = patientInfo.patient_photo
    ? patientInfo.patient_photo
    : constants.PATIENT.DEFAULT_PATIENT_PHOTO_LINK;
  patient.patient_balance = 0.0;
  patient.insurance_balance = 0.0;
  patient.credit_amount = 0.0;
  const insertedPatient = await patient.save();
  const tooth_type =
    insertedPatient.dob == null || calculateAge(insertedPatient.dob) > 13
      ? "ADULT"
      : "CHILD";
  ToothModel.init_tooth_for_patient(insertedPatient._id, tooth_type);
  const result = await Object.assign({}, insertedPatient._doc);
  result.user = await Object.assign({}, insertedUser._doc);
  return result;
};
module.exports.updatePatient = async function (patient_id, patientInfo) {
  const patient = await PatientModel.findById(patient_id);
  if (patient == null) {
    return null;
  }
  const updatedUser = await User.updateUser(patient.user, patientInfo);
  patientInfo.user_type = constants.USER.USER_TYPE_PATIENT;
  patient.patient_id = patientInfo.patient_id
    ? patientInfo.patient_id
    : patient.patient_id;
  patient.active_date = patientInfo.active_date
    ? Date.parse(patientInfo.active_date)
    : patientInfo.active_date;
  patient.is_active =
    patientInfo.is_active != undefined
      ? patientInfo.is_active
      : patient.is_active;
  patient.head_of_household = patientInfo.head_of_household
    ? mongoose.Types.ObjectId(patientInfo.head_of_household)
    : patientInfo.head_of_household;
  patient.patient_type = patientInfo.patient_type
    ? patientInfo.patient_type
    : patient.patient_type;
  patient.new_patient =
    patientInfo.new_patient != undefined
      ? patientInfo.new_patient
      : patient.new_patient;
  patient.medical_alert = patientInfo.medical_alert
    ? patientInfo.medical_alert
    : patient.medical_alert;
  patient.patient_note = patientInfo.patient_note
    ? patientInfo.patient_note
    : patient.patient_note;
  patient.marital_status = patientInfo.marital_status
    ? patientInfo.marital_status
    : patient.marital_status;
  patient.dob = patientInfo.dob ? Date.parse(patientInfo.dob) : patient.dob;
  patient.other_info = patientInfo.other_info
    ? patientInfo.other_info
    : patient.other_info;
  patient.provider = patientInfo.provider
    ? mongoose.Types.ObjectId(patientInfo.provider)
    : patient.provider;
  patient.email_recall =
    patientInfo.email_recall != undefined
      ? patientInfo.email_recall
      : patient.email_recall;
  patient.appt_reminder =
    patientInfo.appt_reminder != undefined
      ? patientInfo.appt_reminder
      : patient.appt_reminder;
  patient.gender = patientInfo.gender ? patientInfo.gender : patient.gender;
  patient.patient_photo = patientInfo.patient_photo
    ? patientInfo.patient_photo
    : patient.patient_photo;
  patient.patient_balance = patientInfo.patient_balance
    ? patientInfo.patient_balance
    : patient.patient_balance;
  patient.insurance_balance = patientInfo.insurance_balance
    ? patientInfo.insurance_balance
    : patient.insurance_balance;
  patient.credit_amount = patientInfo.credit_amount
    ? patientInfo.credit_amount
    : patient.credit_amount;
  const updatedUser = await patient.save();
  const result = await Object.assign({}, updatedUser._doc);
  result.user = await Object.assign({}, updatedUser._doc);
  return result;
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
