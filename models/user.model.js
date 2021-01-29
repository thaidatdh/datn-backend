const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
   first_name: String,
   last_name: String,
   gender: String,
   birthday: String,

}, {
   timestamps: true,
   collection: 'users'
});

module.exports = mongoose.model('user', UserSchema);