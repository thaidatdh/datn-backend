const mongoose = require("mongoose");
const constants = require("../constants/constants");
const Patient = require("./patient.model");
const Staff = require("./staff.model");
const PrescriptionDetail = require("./prescription.detail.model");
const PrescriptionSchema = mongoose.Schema(
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
    prescription_date: Date,
  },
  {
    timestamps: true,
    collection: "prescription",
  }
);
PrescriptionSchema.virtual("details", {
  ref: "prescription_detail",
  localField: "_id",
  foreignField: "prescription",
  justOne: false,
});
const PrescriptionModel = (module.exports = mongoose.model(
  "prescription",
  PrescriptionSchema
));

module.exports.get = async function (query, populateOptions) {
  populateOptions = populateOptions || {};
  const promise = PrescriptionModel.find(query);
  if (populateOptions.get_provider) {
    promise.populate("provider");
  }
  // Limit
  if (populateOptions.limit) {
    promise.limit(Number.parseInt(populateOptions.limit));
  }
  if (populateOptions.get_details) {
    promise.populate({
      path: "details",
      populate: {
        path: "drug",
      },
    });
  }
  const resultQuery = await promise.exec();
  return resultQuery;
};
module.exports.insert = async function (req) {
  let prescription = new PrescriptionModel();
  prescription.patient = req.patient ? req.patient : null;
  prescription.provider = req.provider ? req.provider : null;
  prescription.prescription_date = req.prescription_date
    ? req.prescription_date
    : Date.now();
  return await prescription.save();
};
module.exports.insertWithDetails = async function (req) {
  let prescription = new PrescriptionModel();
  prescription.patient = req.patient ? req.patient : null;
  prescription.provider = req.provider ? req.provider : null;
  prescription.prescription_date = req.prescription_date
    ? req.prescription_date
    : Date.now();
  const insertedPrescription = await prescription.save();
  let inseredDetailList = [];
  for (const detail of req.details) {
    const insertedDetail = await PrescriptionDetail.insertWithPrescriptionId(
      insertedPrescription._id,
      detail
    );
    inseredDetailList.push(insertedDetail);
  }
  insertedPrescription.details = inseredDetailList;
  return insertedPrescription;
};
module.exports.updatePrescription = async function (prescription, req) {
  prescription.patient =
    req.patient !== undefined ? req.patient : prescription.patient;
  prescription.provider = req.provider ? req.provider : prescription.provider;
  prescription.prescription_date = req.prescription_date
    ? req.prescription_date
    : prescription.prescription_date;
  return await prescription.save();
};
