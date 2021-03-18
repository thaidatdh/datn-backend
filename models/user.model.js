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
    theme: Number,
    language: String,
  },
  {
    timestamps: true,
    collection: "users",
  }
);
UserSchema.pre("save", function (next) {
  var user = this;
  if (!user.password || !user.username) {
    user.password = null;
    user.username = null;
    return next();
  }
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

UserSchema.methods.comparePassword = function (pwd, callback) {
  bcrypt.compare(pwd, this.password, function (err, isMatch) {
    if (err) {
      return callback(err, null);
    }
    callback(null, isMatch);
  });
};
const UserModel = (module.exports = mongoose.model("user", UserSchema));
module.exports.insert = async function (userInfo) {
  let user = new UserModel();
  user.first_name = userInfo.first_name ? userInfo.first_name : "";
  user.last_name = userInfo.last_name ? userInfo.last_name : "";
  user.fax = userInfo.fax ? userInfo.fax : null;
  user.mobile_phone = userInfo.mobile_phone ? userInfo.mobile_phone : null;
  user.home_phone = userInfo.home_phone ? userInfo.home_phone : null;
  user.facebook = userInfo.facebook ? userInfo.facebook : null;
  user.email = userInfo.email ? userInfo.email : null;
  user.username = userInfo.username ? userInfo.username : null;
  user.password = userInfo.password ? userInfo.password : null;
  user.user_type = userInfo.user_type
    ? userInfo.user_type
    : constants.USER.USER_TYPE_OTHER;
  user.theme = userInfo.theme ? userInfo.theme : 0;
  user.language = userInfo.language ? userInfo.language : "EN";
  return await user.save();
};
module.exports.updateUser = async function (user_id, userInfo) {
  const user = await UserModel.findById(user_id);
  if (user == null) {
    return null;
  }
  user.first_name =
    userInfo.first_name !== undefined ? userInfo.first_name : user.first_name;
  user.last_name =
    userInfo.last_name !== undefined ? userInfo.last_name : user.last_name;
  user.fax = userInfo.fax !== undefined ? userInfo.fax : user.fax;
  user.mobile_phone =
    userInfo.mobile_phone !== undefined
      ? userInfo.mobile_phone
      : user.mobile_phone;
  user.home_phone =
    userInfo.home_phone !== undefined ? userInfo.home_phone : user.home_phone;
  user.facebook =
    userInfo.facebook !== undefined ? userInfo.facebook : user.facebook;
  user.email = userInfo.email !== undefined ? userInfo.email : user.email;
  user.username =
    userInfo.username !== undefined ? userInfo.username : user.username;
  user.password =
    userInfo.password !== undefined ? userInfo.password : user.password;
  user.user_type =
    userInfo.user_type !== undefined ? userInfo.user_type : user.user_type;
  user.theme = userInfo.theme !== undefined ? userInfo.theme : user.theme;
  user.language =
    userInfo.language !== undefined ? userInfo.language : user.language;
  return await user.save();
};
