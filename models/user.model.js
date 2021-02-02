const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
   first_name: String,
   last_name: String,
   gender: String,
   fax: String,
   mobile_phone: String,
   home_phone: String,
   facebook: String,
   email: String,
   username: {
      type: String,
      default: null,
   },
   password: {
      type: String,
      default: null,
   },
}, {
   timestamps: true,
   collection: 'users'
});

module.exports = mongoose.model('user', UserSchema);