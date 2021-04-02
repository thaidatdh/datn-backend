const mongoose = require("mongoose");
const constants = require("../constants/constants");
const PeriodontalDetail = require("./periodontal.detail.model");
const Patient = require("./patient.model");
const Staff = require("./staff.model");
const PeriodontalSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Types.ObjectId,
      ref: "patient",
      required: true,
    },
    provider: {
      type: mongoose.Types.ObjectId,
      ref: "staff",
      required: true,
    },
    name: String,
    date: Date,
  },
  {
    timestamps: true,
    collection: "periodontal",
  }
);
PeriodontalSchema.virtual("periodontal_detail", {
  ref: "periodontal_detail",
  localField: "_id",
  foreignField: "periodontal",
  justOne: false,
});
module.exports = mongoose.model("periodontal", PeriodontalSchema);
