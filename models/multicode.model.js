const mongoose = require("mongoose");
const MultiCodeDetailModel = require("./multicode.detail.model");
const MultiCodeSchema = mongoose.Schema(
  {
    name: String,
    description: String,
    icon: String,
  },
  {
    timestamps: true,
    collection: "multi_code",
  }
);
MultiCodeSchema.virtual("procedures", {
  ref: "multi_code_detail",
  localField: "_id",
  foreignField: "multi_code_id",
  justOne: false,
});
const MultiCodeModel = (module.exports = mongoose.model(
  "multi_code",
  MultiCodeSchema
));
module.exports.get = async function (query, populateOptions) {
  populateOptions = populateOptions || {};
  const promise = MultiCodeModel.find(query);
  // Limit
  if (populateOptions.limit) {
    promise.limit(Number.parseInt(populateOptions.limit));
  }
  if (populateOptions.get_procedures) {
    promise.populate({
      path: "procedures",
      populate: {
        path: "procedure",
      },
    });
  }
  const resultQuery = await promise.exec();
  return resultQuery;
};
module.exports.insert = async function (multiCodeInfo) {
  let multiCode = new MultiCodeModel();
  multiCode.name = multiCodeInfo.name ? multiCodeInfo.name : null;
  multiCode.description = multiCodeInfo.description
    ? multiCodeInfo.description
    : null;
  multiCode.icon = multiCodeInfo.icon ? multiCodeInfo.icon : null;
  const result = await multiCode.save();
  for (const procedure_code of multiCodeInfo.codes) {
    await MultiCodeDetailModel.insert(result._id, procedure_code);
  }
  return result;
};
