const mongoose = require('mongoose');

const DrugSchema = mongoose.Schema({
   name: String,
   description: String,
}, {
   timestamps: true,
   collection: 'drugs'
});

module.exports = mongoose.model('drug', DrugSchema);