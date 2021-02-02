const mongoose = require('mongoose');

const SpecialistSchema = mongoose.Schema({
   name: String,
}, {
   timestamps: true,
   collection: 'specialists'
});

module.exports = mongoose.model('specialist', SpecialistSchema);