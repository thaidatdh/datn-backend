const { json } = require("body-parser");
let jwt = require("jsonwebtoken");
//Import User Model
const mongoose = require("mongoose");
const constants = require("../constants/constants");
const UserModel = require("../models/user.model");
const StaffModel = require("../models/staff.model");
let tokenList = {};
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
            const returnUser = Object.assign(user, {password: undefined});
            const expiredTimeToken = process.env.TOKEN_EXPIRE
              ? process.env.TOKEN_EXPIRE
              : 3600;
            let expiredDateToken = new Date();
            expiredDateToken.setTime(
              expiredDateToken.getTime() + expiredTimeToken*1000
            );
            const token = jwt.sign(user.toJSON(), process.env.TOKEN_SECRET, {
              expiresIn: expiredTimeToken, //1h
            });
            const expiredTimeRefreshToken = process.env.TOKEN_EXPIRE_REFRESH
              ? process.env.TOKEN_EXPIRE_REFRESH
              : 86400;
            let expiredDateRefreshToken = new Date();
            expiredDateRefreshToken.setTime(
              expiredDateRefreshToken.getTime() + expiredTimeRefreshToken * 1000
            );
            const refreshToken = jwt.sign(
              user.toJSON(),
              process.env.TOKEN_SECRET_REFRESH,
              {
                expiresIn: expiredTimeRefreshToken, //1d
              }
            );
            tokenList[refreshToken] = user;
            // return the information including token as JSON
            return res.json({
              success: true,
              user: returnUser,
              token: token,
              refreshToken: refreshToken,
              expirationTime: expiredDateToken,
              expirationRefreshTime: expiredDateRefreshToken,
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
        message:
          "The username that you've entered doesn't match any patient account.",
        param: "emailNotRegistered",
      });
    } else {
      // check if password matches
      if (req.body.password.length < 8) {
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
            const returnUser = Object.assign(user, { password: undefined });
            const token = jwt.sign(user.toJSON());
            // return the information including token as JSON
            return res.json({
              success: true,
              user: returnUser,
              token: token,
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
    return res.status(500).send("Internal server error");
  }
};

exports.refresh_token = async function (req, res) {
  const { refreshToken } = req.body;
  if (refreshToken && refreshToken in tokenList) {
    try {
      await jwt.verify(
        refreshToken,
        process.env.TOKEN_SECRET_REFRESH
      );
      const user = tokenList[refreshToken];
      if (!user) {
        return res.status(403).json({
          success: false,
          message: "Invalid refresh token",
        });
      }
      const expiredTimeToken = process.env.TOKEN_EXPIRE
        ? process.env.TOKEN_EXPIRE
        : 3600;
      let expiredDateToken = new Date();
      expiredDateToken.setTime(
        expiredDateToken.getTime() + expiredTimeToken * 1000
      );
      const token = jwt.sign(user.toJSON(), expiredTimeToken, {
        expiresIn: expiredTimeToken, //1h
      });
      const response = {
        success: true,
        token: token,
        expirationTime: expiredDateToken,
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
