const { json } = require("body-parser");
let jwt = require("jsonwebtoken");
//Import User Model
const mongoose = require("mongoose");
const constants = require("../constants/constants");
const UserModel = require("../models/user.model");
const tokenList = {};
exports.signin_staff = async function (req, res) {
  try {
    const user = await UserModel.findOne({
      username: req.body.username,
      user_type: { $in: constants.STAFF.STAFF_TYPES },
    });
    if (!user) {
      return res.status(403).send({
        success: false,
        message:
          "The username that you've entered doesn't match any staff account.",
        param: "emailNotRegistered",
      });
    } else {
      // check if password matches
      if (req.body.password.length < 1) {
        return res.status(422).send({
          success: false,
          value: req.body.password,
          message: "Password must be at least 8 chars long",
          param: "password",
          location: "body",
        });
      } else {
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            // if user is found and password is right create a token
            let token = jwt.sign(user.toJSON(), process.env.TOKEN_SECRET, {
              expiresIn: 3600, //1h
            });
            let refreshToken = jwt.sign(
              user.toJSON(),
              process.env.TOKEN_SECRET + "_REFRESH",
              {
                expiresIn: 86400, //1d
              }
            );
            tokenList[refreshToken] = user;
            // return the information including token as JSON
            return res.json({
              success: true,
              user: user,
              token: token,
              refreshToken: refreshToken,
            });
          } else {
            return res.status(403).send({
              success: false,
              message: "Email or password is not correct",
              param: "emailPassword",
            });
          }
        });
      }
    }
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};
exports.signin_patient = async function (req, res) {
  try {
    const user = await UserModel.findOne({
      username: req.body.username,
      user_type: constants.USER.USER_TYPE_PATIENT,
    });
    if (!user) {
      return res.status(403).send({
        success: false,
        errors: [
          {
            msg:
              "The username that you've entered doesn't match any patient account.",
            param: "emailNotRegistered",
          },
        ],
      });
    } else {
      // check if password matches
      if (req.body.password.length < 8) {
        return res.status(422).send({
          success: false,
          errors: [
            {
              value: req.body.password,
              msg: "Password must be at least 8 chars long",
              param: "password",
              location: "body",
            },
          ],
        });
      } else {
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            // if user is found and password is right create a token
            let token = jwt.sign(JSON.stringify(user));
            // return the information including token as JSON
            return res.json({
              success: true,
              user: user,
              token: token,
            });
          } else {
            return res.status(403).send({
              success: false,
              errors: [
                {
                  msg: "Email or password is not correct",
                  param: "emailPassword",
                },
              ],
            });
          }
        });
      }
    }
  } catch (err) {
    return res.status(500).send("Internal server error");
  }
};

exports.refresh_token = async function (req, res) {
  const { refreshToken } = req.body;
  if (refreshToken && refreshToken in tokenList) {
    try {
      await utils.verifyJwtToken(
        refreshToken,
        process.env.TOKEN_SECRET + "_REFRESH"
      );
      const user = tokenList[refreshToken];
      if (!user) {
        return res.status(403).json({
          success: false,
          message: "Invalid refresh token",
        });
      }
      const token = jwt.sign(user, config.secret, {
        expiresIn: 3600, //1h
      });
      const response = {
        success: true,
        token: token,
      };
      res.status(200).json(response);
    } catch (err) {
      console.error(err);
      res.status(403).json({
        success: false,
        message: "Invalid refresh token",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "Invalid request",
    });
  }
};
