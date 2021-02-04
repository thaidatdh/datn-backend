const mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
const constants = require("../constants/constants");
const UserSchema = mongoose.Schema(
  {
    first_name: String,
    last_name: String,
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
    user_type: String,
  },
  {
    timestamps: true,
    collection: "users",
  }
);
UserSchema.pre("save", function (next) {
  var user = this;
  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, null, function (err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

UserSchema.methods.comparePassword = function (passw, cb) {
  bcrypt.compare(passw, this.password, function (err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};
const UserModel = (module.exports = mongoose.model("user", UserSchema));
module.exports.insert = async function (userInfo) {
  let user = new User();
  user.first_name = userInfo.first_name ? userInfo.first_name : "";
  user.last_name = userInfo.last_name ? userInfo.last_name : "";
  user.fax = userInfo.fax ? userInfo.fax : null;
  user.mobile_phone = userInfo.mobile_phone ? userInfo.mobile_phone : null;
  user.home_phone = userInfo.home_phone ? userInfo.home_phone : null;
  user.facebook = userInfo.facebook ? userInfo.facebook : null;
  user.email = userInfo.email ? userInfo.email : null;
  user.username = userInfo.username ? userInfo.username : null;
  user.password = userInfo.password ? userInfo.password : null;
  user.user_type = userInfo.user_type ? userInfo.user_type : constants.USER.USER_TYPE_OTHER;
  return await user.save();
};
