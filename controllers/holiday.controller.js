//Import User Model
const mongoose = require("mongoose");
const constants = require("../constants/constants");
const holidayModel = require("../models/holiday.model");
const translator = require("../utils/translator");
//For index
exports.index = async function (req, res) {
  try {
    const holidays = await holidayModel.find();
    res.json({
      success: true,
      payload: holidays,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "holiday list",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    const holiday = new holidayModel();
    holiday.description = req.body.description ? req.body.description : null;
    holiday.start_date = req.body.start_date ? req.body.start_date : null;
    holiday.end_date = req.body.end_date ? req.body.end_date : null;
    const rs = await holiday.save();
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.INSERT,
        "holiday",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
