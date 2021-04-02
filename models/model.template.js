const mongoose = require("mongoose");
const constants = require("../constants/constants");

const UserSchema = mongoose.Schema(
  {},
  {
    timestamps: true,
    collection: "users",
  }
);

module.exports = mongoose.model("user", UserSchema);
