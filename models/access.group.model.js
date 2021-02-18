const mongoose = require('mongoose');

const AccessGroupSchema = mongoose.Schema({
   name: String,
   value: String,
}, {
   timestamps: true,
   collection: 'access_group'
});

module.exports = mongoose.model("access_group", AccessGroupSchema);