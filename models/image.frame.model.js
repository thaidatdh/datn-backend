const mongoose = require('mongoose');

const ImageFrameSchema = mongoose.Schema({
   image_mouth_id: mongoose.Types.ObjectId,
   image: {
      type: mongoose.Types.ObjectId,
      ref: 'image',
   },
   order: Number,
   width_ratio: Number,
   height_ratio: Number,
   x_ratio: Number,
   y_ratio: Number,
}, {
   timestamps: true,
   collection: 'image_frame'
});
module.exports = mongoose.model("image_frame", ImageFrameSchema);