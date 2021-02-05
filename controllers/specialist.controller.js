//Import User Model
const mongoose = require("mongoose");
const specialistModel = require("../models/specialist.model");
//For index
exports.index = async function (req, res) {
  try {
    const specialists = await specialistModel.find();
    res.json({
      success: true,
      specialists: specialists,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Get specialist list failed",
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    let specialist = new specialistModel();
    specialist.name = req.body.name;
    const rs = await specialist.save();
    return res.json({ success: true, specialist: rs });
  } catch (err) {
    return res.json({
      success: false,
      message: "Insert specialist failed",
      exeption: err,
    });
  }
};
