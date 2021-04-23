const mongoose = require("mongoose");
const constants = require("../constants/constants");

const DocumentCategorySchema = mongoose.Schema(
  {
    name: String,
  },
  {
    timestamps: true,
    collection: "document_category",
  }
);
DocumentCategorySchema.set("toJSON", { virtuals: true });
DocumentCategorySchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("document_category", DocumentCategorySchema);
