const mongoose = require('mongoose');
const Periodontal = require("./periodontal.model");
const PeriodontalDetailSchema = mongoose.Schema(
  {
    periodontal: {
      type: mongoose.Types.ObjectId,
      ref: "periodontal",
      required: true,
    },
    tooth: Number,
    value1: String,
    value2: String,
    value3: String,
  },
  {
    timestamps: true,
    collection: "periodontal_detail",
  }
);
module.exports = mongoose.model("periodontal_detail", PeriodontalDetailSchema);