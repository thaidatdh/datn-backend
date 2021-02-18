const mongoose = require("mongoose");
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

module.exports.get = async function (query, populateOptions) {
  populateOptions = populateOptions || {};
  const promise = DocumentModel.find(query);
  // Limit
  if (populateOptions.limit) {
    promise.limit(limit);
  }
  if (populateOptions.get_patient) {
    promise.populate({
      path: "patient",
      populate: {
        path: "user"
      }
    });
  }
  if (populateOptions.get_category) {
    promise.populate("category");
  }
  const resultQuery = await promise.exec();
  return resultQuery;
};