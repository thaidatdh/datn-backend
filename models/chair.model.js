const mongoose = require('mongoose');

const ChairSchema = mongoose.Schema({
   name: String,
   order: String,
   color: String,
}, {
   timestamps: true,
   collection: 'chairs'
});

module.exports = mongoose.model('chair', ChairSchema);