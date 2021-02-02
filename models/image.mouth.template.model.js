const mongoose = require('mongoose');

const ImageMouthTemplateSchema = mongoose.Schema({
   name: String,
   thumbnail: String,
}, {
   timestamps: true,
   collection: 'image_mouth_template'
});
ImageMouthTemplateSchema.virtual("frames", {
  ref: "image_frame_template",
  localField: "_id",
  foreignField: "image_mouth_template_id",
  justOne: false,
});
module.exports = mongoose.model(
  "image_mouth_template",
  ImageMouthTemplateSchema
);