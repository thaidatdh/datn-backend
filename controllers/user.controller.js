let jwt = require("jsonwebtoken");
//Import User Model
const mongoose = require("mongoose");
User = require("../models/user.model");
//For index
exports.index = function (req, res) {
  User.find({}, function (err, users) {
    if (err)
      res.status(400).send({
        success: false,
        message: "Error",
      });
    res.json({
      success: true,
      users,
    });
  });
};
