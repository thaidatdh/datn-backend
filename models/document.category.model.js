const mongoose = require('mongoose');

const DocumentCategorySchema = mongoose.Schema(
  {
     name: String,
  },
  {
    timestamps: true,
    collection: "document_category",
  }
);

module.exports = mongoose.model("document_category", DocumentCategorySchema);