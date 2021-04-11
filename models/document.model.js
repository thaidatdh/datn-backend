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
    file_path: String,
    file_name: String,
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
  document.file_name = documentinfo.file_name ? documentinfo.file_name : null;
  document.file_path = documentinfo.file_path ? documentinfo.file_path : null;
  document.description = documentinfo.description
    ? documentinfo.description
    : null;
  document.category = documentinfo.category ? documentinfo.category : null;
  return await document.save();
};
module.exports.updateDocument = async function (document, documentinfo) {
  document.name = documentinfo.name ? documentinfo.name : document.name;
  document.file_name =
    documentinfo.file_name !== undefined
      ? documentinfo.file_name
      : document.file_name;
  document.patient =
    documentinfo.patient !== undefined
      ? documentinfo.patient
      : document.patient;
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
  if (populateOptions.limit && populateOptions.page) {
    promise.skip(
      Number.parseInt(populateOptions.limit) *
        Number.parseInt(populateOptions.page)
    );
  }
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
