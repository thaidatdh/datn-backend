const mongoose = require('mongoose');

const ImagesSchema = mongoose.Schema({
   user: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
      required: false,
   },
   image_path: String,
   thumbnail_path: String,

}, {
   timestamps: true,
   collection: 'images'
});

module.exports = mongoose.model('image', ImagesSchema);