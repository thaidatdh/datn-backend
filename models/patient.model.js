const mongoose = require("mongoose");
const constants = require("../constants/constants");
require("./staff.model");
const User = require("./user.model");
const ToothModel = require("./tooth.model");
const { toNumber, calculateAge } = require("../utils/utils");
const PatientSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    patient_id: String,
    patient_id_numeric: Number,
    active_date: Date,
    is_active: Boolean,
    /*head_of_household: {
      type: mongoose.Types.ObjectId,
      ref: "patient",
    },*/
    //patient_type: String, //PATIENT/NON-PATIENT
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
    //email_recall: Boolean,
    //appt_reminder: Boolean,
    plaque_index: Number,
    bleeding_index: Number,
    halitosis: Number,
    gender: {
      type: String,
      default: "NOT_SPECIFY", //MALE, FEMALE, NOT_SPECIFY
    },
    total_amount: mongoose.Types.Decimal128,
    paid_amount: mongoose.Types.Decimal128,
  },
  {
    timestamps: true,
    collection: "patients",
  }
);
PatientSchema.set("toJSON", { virtuals: true });
PatientSchema.set("toObject", { virtuals: true });

const PatientModel = (module.exports = mongoose.model(
  "patient",
  PatientSchema
));
const generatePatientId = (module.exports.generatePatientId = async () => {
  let new_id = 1;
  try {
    const MaxIDFound = await PatientModel.aggregate([
      {
        $group: {
          _id: null,
          max_id: { $max: "$patient_id_numeric" },
        },
      },
      {
        $project: {
          max_id: 1,
        },
      },
    ]);
    const IdObj = MaxIDFound[0];

    if (IdObj && IdObj.max_id) {
      new_id = parseInt(IdObj.max_id) + 1;
    }
    const ListPatientIdObj = await PatientModel.aggregate([
      {
        $project: {
          patient_id: 1,
        },
      },
    ]);
    let ListPatientId = [];
    for (const obj of ListPatientIdObj) {
      ListPatientId.push(obj.patient_id);
    }
    while (ListPatientId.includes(new_id.toString())) {
      new_id = new_id + 1;
    }
  } catch (err) {
    console.log(err);
  }
  return new_id.toString();
});
module.exports.insert = async function (patientInfo) {
  patientInfo.user_type = constants.USER.USER_TYPE_PATIENT;
  const insertedUser = await User.insert(patientInfo);
  const user_id = insertedUser._id;
  let patient = new PatientModel();
  patient.user = user_id;
  patient.patient_id = patientInfo.patient_id ? patientInfo.patient_id : null;
  patient.patient_id_numeric = toNumber(patient.patient_id);
  patient.active_date = patientInfo.active_date
    ? new Date(patientInfo.active_date)
    : new Date(Date.now());
  patient.is_active =
    patientInfo.is_active != undefined
      ? patientInfo.is_active
      : constants.PATIENT.DEFAULT_IS_ACTIVE;
  /*patient.head_of_household = patientInfo.head_of_household
    ? mongoose.Types.ObjectId(patientInfo.head_of_household)
    : null;
  patient.patient_type = patientInfo.patient_type
    ? patientInfo.patient_type
    : patient.patient_type;*/
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
  /*patient.email_recall =
    patientInfo.email_recall != undefined
      ? patientInfo.email_recall
      : constants.PATIENT.DEFAULT_EMAIL_RECALL;
  patient.appt_reminder =
    patientInfo.appt_reminder != undefined
      ? patientInfo.appt_reminder
      : constants.PATIENT.DEFAULT_APPT_REMINDER;*/
  patient.gender = patientInfo.gender
    ? patientInfo.gender
    : constants.DEFAULT_GENDER;
  patient.total_amount = 0.0;
  patient.paid_amount = 0.0;
  patient.plaque_index = patientInfo.plaque_index
    ? patientInfo.plaque_index
    : 0;
  patient.bleeding_index = patientInfo.bleeding_index
    ? patientInfo.bleeding_index
    : 0;
  patient.halitosis = patientInfo.halitosis ? patientInfo.halitosis : 0;
  if (patient.new_patient == false && patient.patient_id == null) {
    patient.patient_id = generatePatientId();
    patient.patient_id_numeric = toNumber(patient.patient_id);
  }
  const insertedPatient = await patient.save();
  const tooth_type =
    insertedPatient.dob == null || calculateAge(insertedPatient.dob) > 13
      ? constants.TOOTH.TOOTH_TYPE_ADULT
      : constants.TOOTH.TOOTH_TYPE_CHILD;
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
  const updatedUser = await User.updateUser(patient.user._id, patientInfo);
  patientInfo.user_type = constants.USER.USER_TYPE_PATIENT;
  patient.patient_id =
    patientInfo.patient_id !== undefined
      ? patientInfo.patient_id
      : patient.patient_id;
  patient.patient_id_numeric = toNumber(patient.patient_id);
  patient.active_date =
    patientInfo.active_date != undefined
      ? new Date(patientInfo.active_date)
      : patientInfo.active_date;
  patient.is_active =
    patientInfo.is_active != undefined
      ? patientInfo.is_active
      : patient.is_active;
  /*patient.head_of_household =
    patientInfo.head_of_household !== undefined
      ? patientInfo.head_of_household
      : patient.head_of_household;
  patient.patient_type =
    patientInfo.patient_type != undefined
      ? patientInfo.patient_type
      : patient.patient_type;*/
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
  /*patient.email_recall =
    patientInfo.email_recall != undefined
      ? patientInfo.email_recall
      : patient.email_recall;
  patient.appt_reminder =
    patientInfo.appt_reminder !== undefined
      ? patientInfo.appt_reminder
      : patient.appt_reminder;*/
  patient.gender =
    patientInfo.gender !== undefined ? patientInfo.gender : patient.gender;
  patient.total_amount =
    patientInfo.total_amount != undefined
      ? patientInfo.total_amount
      : patient.total_amount;
  patient.paid_amount =
    patientInfo.paid_amount != undefined
      ? patientInfo.paid_amount
      : patient.paid_amount;
  patient.plaque_index = patientInfo.plaque_index
    ? patientInfo.plaque_index
    : patient.plaque_index;
  patient.bleeding_index = patientInfo.bleeding_index
    ? patientInfo.bleeding_index
    : patient.bleeding_index;
  patient.halitosis = patientInfo.halitosis
    ? patientInfo.halitosis
    : patient.halitosis;
  if (patient.new_patient === true) {
    if (patient.patient_id == null) {
      patient.patient_id = await generatePatientId();
      patient.patient_id_numeric = toNumber(patient.patient_id);
    }
    patient.new_patient = false;
  }
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
  if (populateOptions.one) {
    return resultQuery.length > 0 ? resultQuery[0] : null;
  }
  return resultQuery;
};
module.exports.updatePaidAmount = async (patient_id, amount, type) => {
  const Patient = await PatientModel.findById(patient_id);
  if (!Patient) {
    return false;
  }
  const amountNumber = parseFloat(amount);
  const originalAmount = parseFloat(Patient.paid_amount.toString());
  if (type === constants.TRANSACTION.INCREASE) {
    Patient.paid_amount = originalAmount + amountNumber;
  } else if (type == constants.TRANSACTION.DECREASE) {
    const result = originalAmount - amountNumber;;
    Patient.paid_amount = result == "NaN" ? 0 : result;
  }
  await Patient.save();
  return true;
};
module.exports.updateBalance = async (patient_id, amount, type) => {
  const Patient = await PatientModel.findById(patient_id);
  if (!Patient) {
    return false;
  }
  const amountNumber = parseFloat(amount);
  const originalAmount = parseFloat(Patient.total_amount.toString());
  if (type === constants.TRANSACTION.INCREASE) {
    Patient.total_amount = originalAmount + amountNumber;
  } else if (type == constants.TRANSACTION.DECREASE) {
    Patient.total_amount = originalAmount - amountNumber;
  }
  await Patient.save();
  return true;
};
module.exports.updateCredit = async (patient_id, amount, type) => {
  const Patient = await PatientModel.findById(patient_id);
  if (!Patient) {
    return false;
  }
  const amountNumber = parseFloat(amount);
  const originalAmount = parseFloat(Patient.credit_amount.toString());
  if (type === constants.TRANSACTION.INCREASE) {
    Patient.credit_amount = originalAmount + amountNumber;
  } else if (type == constants.TRANSACTION.DECREASE) {
    Patient.credit_amount = originalAmount - amountNumber;
  }
  await Patient.save();
  return true;
};
