const mongoose = require('mongoose');
const Patient = require("./patient.model");
const Staff = require("./staff.model");
const ImageMouthSchema = mongoose.Schema(
  {
    name: String,
    note: String,
    entry_date: Date,
    thumbnail: String,
    created_by: {
      type: mongoose.Types.ObjectId,
      ref: "staff",
      required: true,
    },
    patient: {
      type: mongoose.Types.ObjectId,
      ref: "patient",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "image_mouth",
  }
);
ImageMouthSchema.virtual("frames", {
  ref: "image_frame",
  localField: "_id",
  foreignField: "image_mouth_id",
  justOne: false,
});
module.exports = mongoose.model("image_mouth", ImageMouthSchema);