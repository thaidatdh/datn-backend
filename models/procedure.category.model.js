const mongoose = require("mongoose");
const constants = require("../constants/constants");
require("./procedure.code.model");
const ProcedureCategorySchema = mongoose.Schema(
  {
    name: String,
    icon: String,
  },
  {
    timestamps: true,
    collection: "procedure_category",
  }
);
ProcedureCategorySchema.virtual("procedure_code", {
  ref: "procedure_code",
  localField: "_id",
  foreignField: "category",
  justOne: false,
});
const CategoryModel = (module.exports = mongoose.model(
  "procedure_category",
  ProcedureCategorySchema
));

module.exports.get = async function (query, populateOptions) {
  populateOptions = populateOptions || {};
  const promise = CategoryModel.find(query);
  // Limit
  if (populateOptions.limit) {
    promise.limit(Number.parseInt(populateOptions.limit));
  }
  if (populateOptions.get_codes) {
    promise.populate("procedure_code");
  }
  const resultQuery = await promise.exec();
  return resultQuery;
};
