const mongoose = require("mongoose");
const constants = require("../constants/constants");

const NoteMacroSchema = mongoose.Schema(
  {
    content: String,
    note_type: String,
  },
  {
    timestamps: true,
    collection: "note_macro",
  }
);

const NoteMacroModel = (module.exports = mongoose.model(
  "note_macro",
  NoteMacroSchema
));
module.exports.get = async function (query, populateOptions) {
  populateOptions = populateOptions || {};
  const promise = NoteMacroModel.find(query);
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
  const resultQuery = await promise.exec();
  return resultQuery;
};
