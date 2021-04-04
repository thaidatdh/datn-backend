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
    ? new Date(patientInfo.active_date)
    : new Date(Date.now());
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
  let patient = await PatientModel.findById(patient_id);
  if (patient == null) {
    return null;
  }
  const updatedUser = await User.updateUser(patient.user, patientInfo);
  patientInfo.user_type = constants.USER.USER_TYPE_PATIENT;
  patient.patient_id =
    patientInfo.patient_id !== undefined
      ? patientInfo.patient_id
      : patient.patient_id;
  patient.active_date =
    patientInfo.active_date != undefined
      ? new Date(patientInfo.active_date)
      : patientInfo.active_date;
  patient.is_active =
    patientInfo.is_active != undefined
      ? patientInfo.is_active
      : patient.is_active;
  patient.head_of_household =
    patientInfo.head_of_household !== undefined
      ? patientInfo.head_of_household
      : patient.head_of_household;
  patient.patient_type =
    patientInfo.patient_type != undefined
      ? patientInfo.patient_type
      : patient.patient_type;
  patient.new_patient =
    patientInfo.new_patient != undefined
      ? patientInfo.new_patient
      : patient.new_patient;
  patient.medical_alert =
    patientInfo.medical_alert !== undefined
      ? patientInfo.medical_alert
      : patient.medical_alert;
  patient.patient_note =
    patientInfo.patient_note !== undefined
      ? patientInfo.patient_note
      : patient.patient_note;
  patient.marital_status =
    patientInfo.marital_status != undefined
      ? patientInfo.marital_status
      : patient.marital_status;
  patient.dob =
    patientInfo.dob != undefined ? Date.parse(patientInfo.dob) : patient.dob;
  patient.other_info =
    patientInfo.other_info != undefined
      ? patientInfo.other_info
      : patient.other_info;
  patient.provider =
    patientInfo.provider !== undefined
      ? patientInfo.provider
      : patient.provider;
  patient.email_recall =
    patientInfo.email_recall != undefined
      ? patientInfo.email_recall
      : patient.email_recall;
  patient.appt_reminder =
    patientInfo.appt_reminder !== undefined
      ? patientInfo.appt_reminder
      : patient.appt_reminder;
  patient.gender =
    patientInfo.gender !== undefined ? patientInfo.gender : patient.gender;
  patient.patient_photo =
    patientInfo.patient_photo !== undefined
      ? patientInfo.patient_photo
      : patient.patient_photo;
  patient.patient_balance =
    patientInfo.patient_balance != undefined
      ? patientInfo.patient_balance
      : patient.patient_balance;
  patient.insurance_balance =
    patientInfo.insurance_balance != undefined
      ? patientInfo.insurance_balance
      : patient.insurance_balance;
  patient.credit_amount =
    patientInfo.credit_amount != undefined
      ? patientInfo.credit_amount
      : patient.credit_amount;
  const updatedPatient = await patient.save();
  const result = await Object.assign({}, updatedPatient._doc);
  result.user = await Object.assign({}, updatedUser._doc);
  return result;
};
module.exports.get = async function (query, populateOptions) {
  populateOptions = populateOptions || {};
  const promise = PatientModel.find(query);
  promise.populate({
    path: "user",
    select: {
      _id: 1,
      first_name: 1,
      last_name: 1,
      fax: 1,
      mobile_phone: 1,
      home_phone: 1,
      facebook: 1,
      email: 1,
      username: 1,
      user_type: 1,
      theme: 1,
      language: 1,
    },
  });
  // Limit
  if (populateOptions.limit && populateOptions.page) {
    promise.skip(
      Number.parseInt(populateOptions.limit) *
        Number.parseInt(populateOptions.page)
    );
  }
  if (populateOptions.limit) {
    promise.limit(Number.parseInt(populateOptions.limit));
  }
  if (populateOptions.get_hohh) {
    promise.populate({
      path: "head_of_household",
      select: {
        user: 1,
        patient_id: 1,
        is_active: 1,
      },
      populate: {
        path: "user",
        select: {
          _id: 1,
          first_name: 1,
          last_name: 1,
        },
      },
    });
  }
  if (populateOptions.get_provider) {
    promise.populate({
      path: "provider",
      select: {
        staff_type: 1,
        display_id: 1,
        is_active: 1,
        user: 1,
      },
      populate: {
        path: "user",
        select: {
          _id: 1,
          first_name: 1,
          last_name: 1,
        },
      },
    });
  }
  const resultQuery = await promise.exec();
  return resultQuery;
};
