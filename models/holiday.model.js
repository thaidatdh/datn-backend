const mongoose = require('mongoose');

const HolidaySchema = mongoose.Schema(
  {
    day: String,
    start_date: Date,
    end_date: Date,
  },
  {
    timestamps: true,
    collection: "holiday",
  }
);
module.exports = mongoose.model(
  "holiday",
  HolidaySchema
);