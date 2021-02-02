const mongoose = require('mongoose');

const ImageFrameTemplateSchema = mongoose.Schema(
  {
    image_mouth_template_id: mongoose.Types.ObjectId,
    order: Number,
    width_ratio: Number,
    height_ratio: Number,
    x_ratio: Number,
    y_ratio: Number,
  },
  {
    timestamps: true,
    collection: "image_frame_template",
  }
);
module.exports = mongoose.model(
  "image_frame_template",
  ImageFrameTemplateSchema
);