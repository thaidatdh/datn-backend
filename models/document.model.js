const mongoose = require("mongoose");
const constants = require("../constants/constants");
const Category = require("./document.category.model");
const Patient = require("./patient.model");
const DocumentSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Types.ObjectId,
      ref: "patient",
      required: false,
    },
    filepath: String,
    name: String,
    description: String,
    category: {
      type: mongoose.Types.ObjectId,
      ref: "document_category",
      required: false,
    },
  },
  {
    timestamps: true,
    collection: "document",
  }
);

const DocumentModel = (module.exports = mongoose.model(
  "document",
  DocumentSchema
));
module.exports.insert = async function (documentinfo) {
  let document = new DocumentModel();
  document.name = documentinfo.name
    ? documentinfo.name
    : Date.now().toString("dd/mm/yyyy");
  document.patient = documentinfo.patient ? documentinfo.patient : null;
  document.filepath = documentinfo.filepath ? documentinfo.filepath : null;
  document.description = documentinfo.description
    ? documentinfo.description
    : null;
  document.category = documentinfo.category ? documentinfo.category : null;
  return await document.save();
};
module.exports.updateDocument = async function (document, documentinfo) {
  document.name = documentinfo.name ? documentinfo.name : document.name;
  document.patient =
    documentinfo.patient !== undefined
      ? documentinfo.patient
      : document.patient;
  document.filepath =
    documentinfo.filepath !== undefined
      ? documentinfo.filepath
      : document.filepath;
  document.description =
    documentinfo.description !== undefined
      ? documentinfo.description
      : document.description;
  document.category =
    documentinfo.category !== undefined
      ? documentinfo.category
      : document.category;
  return await document.save();
};
module.exports.get = async function (query, populateOptions) {
  populateOptions = populateOptions || {};
  const promise = DocumentModel.find(query);
  // Limit
  if (populateOptions.limit) {
    promise.limit(Number.parseInt(populateOptions.limit));
  }
  if (populateOptions.get_patient) {
    promise.populate({
      path: "patient",
      populate: {
        path: "user",
      },
    });
  }
  if (populateOptions.get_category) {
    promise.populate("category");
  }
  const resultQuery = await promise.exec();
  return resultQuery;
};
