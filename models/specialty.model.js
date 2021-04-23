const mongoose = require("mongoose");
const constants = require("../constants/constants");

const SpecialtySchema = mongoose.Schema(
  {
    name: String,
  },
  {
    timestamps: true,
    collection: "specialty",
  }
);
SpecialtySchema.set("toJSON", { virtuals: true });
SpecialtySchema.set("toObject", { virtuals: true });

const SpecialtyModel = (module.exports = mongoose.model(
  "specialty",
  SpecialtySchema
));
