const mongoose = require("mongoose");
const constants = require("../constants/constants");

const HolidaySchema = mongoose.Schema(
  {
    description: String,
    start_date: String,
    end_date: String,
  },
  {
    timestamps: true,
    collection: "holiday",
  }
);
const HolidayModel = (module.exports = mongoose.model(
  "holiday",
  HolidaySchema
));
module.exports.get = async function (query, populateOptions) {
  populateOptions = populateOptions || {};
  const promise = HolidayModel.find(query);
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
