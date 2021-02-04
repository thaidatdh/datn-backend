const mongoose = require('mongoose');
const Staff = require("./staff.model");
const ProviderWorkingTimeSchema = mongoose.Schema(
  {
    provider: {
      type: mongoose.Types.ObjectId,
      ref: "staff",
      required: true,
    },
    day: String,
    start_time: String,
    end_time: String,
  },
  {
    timestamps: true,
    collection: "provider_working_time",
  }
);
module.exports = mongoose.model(
  "provider_working_time",
  ProviderWorkingTimeSchema
);