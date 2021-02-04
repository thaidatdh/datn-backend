const mongoose = require('mongoose');

const PracticeWorkingTimeSchema = mongoose.Schema(
  {
    day: String,
    start_time: String,
    end_time: String,
  },
  {
    timestamps: true,
    collection: "practice_working_time",
  }
);
module.exports = mongoose.model(
  "practice_working_time",
  PracticeWorkingTimeSchema
);