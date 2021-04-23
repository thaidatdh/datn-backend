//deprecated
const mongoose = require("mongoose");
const constants = require("../constants/constants");
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
    reset_date: String,
    insurance_number: String,
  },
  {
    timestamps: true,
    collection: "patient_insurance",
  }
);
PatientInsuranceSchema.set("toJSON", { virtuals: true });
PatientInsuranceSchema.set("toObject", { virtuals: true });

const InsuranceModel = (module.exports = mongoose.model(
  "patient_insurance",
  PatientInsuranceSchema
));

module.exports.get = async function (query, populateOptions) {
  populateOptions = populateOptions || {};
  const promise = InsuranceModel.find(query);
  // Limit
  if (populateOptions.limit) {
    promise.limit(Number.parseInt(populateOptions.limit));
  }
  if (populateOptions.get_patient) {
    promise.populate({
      path: "patient",
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
  if (populateOptions.get_insurer) {
    promise.populate("insurer");
  }
  const resultQuery = await promise.exec();
  return resultQuery;
};
module.exports.insert = async function (req) {
  let insurance = new InsuranceModel();
  insurance.start_date = req.start_date
    ? Date.parse(req.start_date)
    : Date.now();
  insurance.reset_date = req.reset_date
    ? Date.parse(req.reset_date).toString("dd/MM")
    : "01/01";
  insurance.patient = req.patient ? req.patient : null;
  insurance.insurer = req.insurer ? req.insurer : null;
  insurance.insurance_number = req.insurance_number
    ? req.insurance_number
    : null;
  return await insurance.save();
};
module.exports.updateInsurance = async function (insurance, req) {
  insurance.start_date = req.start_date
    ? Date.parse(req.start_date)
    : insurance.start_date;
  insurance.reset_date = req.reset_date
    ? Date.parse(req.reset_date).toString("dd/MM")
    : insurance.reset_date;
  insurance.patient =
    req.patient !== undefined ? req.patient : insurance.patient;
  insurance.insurer =
    req.insurer !== undefined ? req.insurer : insurance.insurer;
  insurance.insurance_number =
    req.insurance_number !== undefined
      ? req.insurance_number
      : insurance.insurance_number;
  return await insurance.save();
};
