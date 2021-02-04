const mongoose = require('mongoose');
const Patient = require("./patient.model");
const ImagesSchema = mongoose.Schema({
   patient: {
      type: mongoose.Types.ObjectId,
      ref: 'patient',
      required: false,
   },
   image_path: String,
   thumbnail_path: String,

}, {
   timestamps: true,
   collection: 'images'
});

module.exports = mongoose.model('image', ImagesSchema);