const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({

}, {
   timestamps: true,
   collection: 'users'
});

module.exports = mongoose.model('user', UserSchema);