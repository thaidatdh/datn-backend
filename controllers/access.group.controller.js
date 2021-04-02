//Import User Model
const mongoose = require("mongoose");
const constants = require("../constants/constants");
const accessModel = require("../models/access.group.model");
const translator = require("../utils/translator");
//For index
exports.index = async function (req, res) {
  try {
    const access = await accessModel.find({
      role: req.decoded.user_type,
      is_front_end: true,
    });
    res.json({
      success: true,
      payload: access,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "access group list",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    const rs = await accessModel.insert(req.body);
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.INSERT,
        "access group",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
