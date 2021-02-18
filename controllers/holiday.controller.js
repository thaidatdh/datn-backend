//Import User Model
const mongoose = require("mongoose");
const holidayModel = require("../models/holiday.model");
//For index
exports.index = async function (req, res) {
  try {
    const holidays = await holidayModel.find();
    res.json({
      success: true,
      holidays: holidays,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Get holiday list failed",
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    const holiday = new holidayModel();
    holiday.day = req.body.day ? req.body.day : null;
    holiday.start_date = req.body.start_date ? req.body.start_date : null;
    holiday.end_date = req.body.end_date ? req.body.end_date : null;
    const rs = await holiday.save();
    return res.json({ success: true, access: rs });
  } catch (err) {
    return res.json({
      success: false,
      message: "Insert holiday failed",
      exeption: err,
    });
  }
};
