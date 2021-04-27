const { json } = require("body-parser");
let jwt = require("jsonwebtoken");
//Import User Model
const mongoose = require("mongoose");
const constants = require("../constants/constants");
const UserModel = require("../models/user.model");
const StaffModel = require("../models/staff.model");
const PatientModel = require("../models/patient.model");
const translator = require("../utils/translator");
const { formatPhone } = require("../utils/utils");
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
      if (req.body.password.length < 8) {
        return res.status(422).send({
          success: false,
          value: req.body.password,
          message: await translator.Translate(
            "Password must be at least 8 chars long",
            req.query.lang
          ),
          param: "password",
          location: "body",
        });
      } else {
        try {
          const isMatch = await user.comparePassword(req.body.password);
          if (isMatch) {
            // if user is found and password is right create a token
            const returnStaff = await StaffModel.get(
              { user: user._id },
              { one: true, limit: 1 }
            );
            const returnUser = await Object.assign(
              {
                staff_id: returnStaff ? returnStaff._id : null,
                is_active: returnStaff ? returnStaff.is_active : false,
              },
              user._doc,
              {
                password: undefined,
              }
            );
            if (returnUser.is_active == false) {
              return res.status(403).send({
                success: false,
                message: await translator.Translate(
                  "Inactive Staff. Access denied.",
                  req.query.lang
                ),
                param: "inactive",
              });
            }
            const expiredTimeToken = process.env.TOKEN_EXPIRE
              ? Number.parseInt(process.env.TOKEN_EXPIRE)
              : 3600;
            let expiredDateToken = new Date();
            expiredDateToken.setTime(
              expiredDateToken.getTime() + expiredTimeToken * 1000
            );
            const token = jwt.sign(returnUser, process.env.TOKEN_SECRET, {
              expiresIn: expiredTimeToken, //1h
            });
            const expiredTimeRefreshToken = process.env.TOKEN_EXPIRE_REFRESH
              ? Number.parseInt(process.env.TOKEN_EXPIRE_REFRESH)
              : 86400;
            let expiredDateRefreshToken = new Date();
            expiredDateRefreshToken.setTime(
              expiredDateRefreshToken.getTime() + expiredTimeRefreshToken * 1000
            );
            const refreshToken = jwt.sign(
              returnUser,
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
              message: await translator.Translate(
                "Email or password is not correct",
                req.query.lang
              ),
              param: "emailPassword",
            });
          }
        } catch (error) {
          console.log(error);
          return res.status(500).send({
            success: false,
            message: await translator.Translate(
              "Internal server error when compare password",
              req.query.lang
            ),
          });
        }
      }
    }
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: await translator.Translate(
        "Internal server error",
        req.query.lang
      ),
    });
  }
};
exports.signin_patient = async function (req, res) {
  try {
    const formatedPhone = formatPhone(req.body.phone);
    const user = await UserModel.findOne({
      $or: [
        { mobile_phone: formatedPhone },
        { home_phone: formatedPhone },
        { username: req.body.phone },
      ],
      user_type: constants.USER.USER_TYPE_PATIENT,
    });
    if (!user) {
      return res.status(403).send({
        success: false,
        message:
          "The phone that you've entered doesn't match any staff account.",
        param: "emailNotRegistered",
      });
    } else {
      // check if password matches
      if (req.body.password.length < 6) {
        return res.status(422).send({
          success: false,
          value: req.body.password,
          message: await translator.Translate(
            "Password must be at least 6 chars long",
            req.query.lang
          ),
          param: "password",
          location: "body",
        });
      } else {
        try {
          const isMatch = await user.comparePassword(req.body.password);
          if (isMatch) {
            // if user is found and password is right create a token
            const returnPatient = await PatientModel.get(
              { user: user._id },
              { one: true, limit: 1 }
            );
            const returnUser = await Object.assign(
              {
                patient_id: returnPatient ? returnPatient._id : null,
                display_id: returnPatient ? returnPatient.patient_id : null,
                is_active: returnPatient ? returnPatient.is_active : false,
              },
              user._doc,
              {
                password: undefined,
              }
            );
            const token = jwt.sign(returnUser, process.env.TOKEN_SECRET);

            // return the information including token as JSON
            return res.json({
              success: true,
              user: returnUser,
              token: token,
            });
          } else {
            return res.status(403).send({
              success: false,
              message: await translator.Translate(
                "Phone or password is not correct",
                req.query.lang
              ),
              param: "phonePassword",
            });
          }
        } catch (error) {
          console.log(error);
          return res.status(500).send({
            success: false,
            message: await translator.Translate(
              "Internal server error when compare password",
              req.query.lang
            ),
          });
        }
      }
    }
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: await translator.Translate(
        "Internal server error",
        req.query.lang
      ),
    });
  }
};

exports.refresh_token = async function (req, res) {
  const { refreshToken } = req.body;
  if (refreshToken && refreshToken in tokenList) {
    try {
      await jwt.verify(refreshToken, process.env.TOKEN_SECRET_REFRESH);
      const user = tokenList[refreshToken];
      if (!user) {
        return res.status(403).json({
          success: false,
          message: await translator.Translate(
            "Invalid refresh token",
            req.query.lang
          ),
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
        message: await translator.Translate(
          "Invalid refresh token",
          req.query.lang
        ),
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: await translator.Translate("Invalid request", req.query.lang),
    });
  }
};

exports.change_password = async function (req, res) {
  let old_password = req.body.old_password ? req.body.old_password : "";
  let password = req.body.password ? req.body.password : "";
  const user_id = req.decoded ? req.decoded._id : null;
  if (user_id == null) {
    return res.status(403).send({
      success: false,
      message: "User ID from token not found",
    });
  }
  try {
    const user = await UserModel.findById(user_id);
    if (user == null) {
      return res.status(403).send({
        success: false,
        message: "User not found",
      });
    }
    if (password.length < 8 || old_password.length < 8) {
      return res.status(422).send({
        success: false,
        value: password,
        message: await translator.Translate(
          "Password must be at least 8 chars long",
          req.query.lang
        ),
        param: "password",
        location: "body",
      });
    } else {
      const isMatch = await user.comparePassword(old_password);
      if (isMatch) {
        user.password = password;
        const result = await user.save();
        if (result) {
          return res.status(200).send({
            success: true,
            message: await translator.Translate(
              "Change password successfully",
              req.query.lang
            ),
          });
        } else {
          return res.status(500).send({
            success: false,
            message: await translator.Translate(
              "ERROR! Change password failed.",
              req.query.lang
            ),
          });
        }
      } else {
        return res.status(403).send({
          success: false,
          value: password,
          message: await translator.Translate(
            "Incorrect Old Password ",
            req.query.lang
          ),
          param: "password",
          location: "body",
        });
      }
    }
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: await translator.Translate(
        "Internal server error",
        req.query.lang
      ),
    });
  }
};
exports.updateProfile = async function (req, res) {
  if (req.decoded == null) {
    return res.status(403).send({
      success: false,
      message: "Decode data from token not found",
    });
  }
  let is_patient = false;
  let id = null;
  const requestBody = Object.assign({}, req.body);
  if (
    req.decoded &&
    req.decoded.user_type == constants.USER.USER_TYPE_PATIENT
  ) {
    is_patient = true;
    id = req.decoded.patient_id;
  } else {
    is_patient = false;
    id = req.decoded.staff_id;
  }
  if (id == null) {
    return res.status(403).send({
      success: false,
      message: "ID from token not found",
    });
  }
  try {
    if (is_patient) {
      const rs = await PatientModel.updatePatient(id, requestBody);
      if (rs) {
        return res.json({ success: true, payload: rs });
      } else {
        return res.status(404).json({
          success: false,
          message: await translator.NotFoundMessage("Patient", req.query.lang),
        });
      }
    } else {
      const staff = await StaffModel.findById(id);
      if (staff == null) {
        return res.status(404).json({
          success: false,
          message: await translator.NotFoundMessage("Staff", req.query.lang),
        });
      }
      const rs = await StaffModel.updateStaff(staff, requestBody);
      return res.json({ success: true, payload: rs });
    }
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: await translator.Translate(
        "Internal server error",
        req.query.lang
      ),
    });
  }
};
exports.getProfile = async function (req, res) {
  if (req.decoded == null) {
    return res.status(403).send({
      success: false,
      message: "Decode data from token not found",
    });
  }
  let is_patient = false;
  let id = null;
  if (
    req.decoded &&
    req.decoded.user_type == constants.USER.USER_TYPE_PATIENT
  ) {
    is_patient = true;
    id = req.decoded.patient_id;
  } else {
    is_patient = false;
    id = req.decoded.staff_id;
  }
  if (id == null) {
    return res.status(403).send({
      success: false,
      message: "ID from token not found",
    });
  }
  try {
    if (is_patient) {
      const rs = await PatientModel.get({ _id: id }, { one: true });
      if (rs == null) {
        return res.status(404).json({
          success: false,
          message: await translator.NotFoundMessage("Patient", req.query.lang),
        });
      }
      return res.json({ success: true, payload: rs });
    } else {
      const staff = await StaffModel.get({ _id: id }, { one: true });
      if (staff == null) {
        return res.status(404).json({
          success: false,
          message: await translator.NotFoundMessage("Staff", req.query.lang),
        });
      }
      return res.json({ success: true, payload: staff });
    }
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: await translator.Translate(
        "Internal server error",
        req.query.lang
      ),
    });
  }
};
