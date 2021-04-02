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
module.exports = mongoose.model("holiday", HolidaySchema);
