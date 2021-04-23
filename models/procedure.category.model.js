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
ProcedureCategorySchema.set("toJSON", { virtuals: true });
ProcedureCategorySchema.set("toObject", { virtuals: true });

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
    promise.populate({
      path: "procedure_code",
      select: {
        _id: 1,
        procedure_code: 1,
        description: 1,
      },
    });
  }
  const resultQuery = await promise.exec();
  return resultQuery;
};
