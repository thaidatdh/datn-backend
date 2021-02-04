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

module.exports = mongoose.model("document", DocumentSchema);
