const mongoose = require("mongoose");
const constants = require("../constants/constants");
const Prescription = require("./prescription.model");
const PrescriptionDetailSchema = mongoose.Schema(
  {
    prescription: {
      type: mongoose.Types.ObjectId,
      ref: "prescription",
      required: true,
    },
    is_deleted: Boolean,
    expiry_date: Date,
    drug: {
      type: mongoose.Types.ObjectId,
      ref: "drug",
      required: true,
    },
    refill: String,
    dispensed: String,
    quantity: String,
    description: String,
  },
  {
    timestamps: true,
    collection: "prescription_detail",
  }
);
PrescriptionDetailSchema.set("toJSON", { virtuals: true });
PrescriptionDetailSchema.set("toObject", { virtuals: true });

const PrescriptionDetailModel = (module.exports = mongoose.model(
  "prescription_detail",
  PrescriptionDetailSchema
));
module.exports.get = async function (query, populateOptions) {
  populateOptions = populateOptions || {};
  const promise = PrescriptionDetailModel.find(query);
  promise.populate("drug");
  // Limit
  if (populateOptions.limit) {
    promise.limit(Number.parseInt(populateOptions.limit));
  }
  const resultQuery = await promise.exec();
  return resultQuery;
};
module.exports.insert = async function (req) {
  let detail = new PrescriptionDetailModel();
  detail.prescription = req.prescription ? req.prescription : null;
  detail.is_deleted = req.is_deleted ? req.is_deleted : false;
  detail.status = req.status ? req.status : null;
  detail.drug = req.drug ? req.drug : null;
  detail.refill = req.refill ? req.refill : null;
  detail.dispensed = req.dispensed ? req.dispensed : null;
  detail.quantity = req.quantity ? req.quantity : null;
  detail.description = req.description ? req.description : null;
  detail.expiry_date = req.expiry_date ? req.expiry_date : null;
  return await detail.save();
};
module.exports.insertWithPrescriptionId = async function (
  prescription_id,
  req
) {
  let detail = new PrescriptionDetailModel();
  detail.prescription = prescription_id ? prescription_id : null;
  detail.is_deleted = req.is_deleted ? req.is_deleted : false;
  detail.status = req.status ? req.status : null;
  detail.drug = req.drug ? req.drug : null;
  detail.refill = req.refill ? req.refill : null;
  detail.dispensed = req.dispensed ? req.dispensed : null;
  detail.quantity = req.quantity ? req.quantity : null;
  detail.description = req.description ? req.description : null;
  detail.expiry_date = req.expiry_date ? req.expiry_date : null;
  return await detail.save();
};
module.exports.updateDetail = async function (detail, req) {
  detail.is_deleted =
    req.is_deleted !== undefined ? req.is_deleted : detail.is_deleted;
  detail.status = req.status ? req.status : detail.status;
  detail.drug = req.drug ? req.drug : detail.drug;
  detail.refill = req.refill ? req.refill : detail.refill;
  detail.dispensed = req.dispensed ? req.dispensed : detail.dispensed;
  detail.quantity = req.quantity ? req.quantity : detail.quantity;
  detail.description = req.description ? req.description : detail.description;
  detail.expiry_date =
    req.expiry_date !== undefined ? req.expiry_date : detail.expiry_date;
  return await detail.save();
};
