//Import User Model
const mongoose = require("mongoose");
const practiceModel = require("../models/practice.model");
//For index
exports.index = async function (req, res) {
  try {
    const practices = await practiceModel.find();
    res.json({
      success: true,
      practices: practices,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Get practice list failed",
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    const practiceInfo = req.body;
    const rs = practiceModel.updatePractice(practiceInfo);
    return res.json({ success: true, practice: rs });
  } catch (err) {
    return res.json({
      success: false,
      message: "Insert practice failed",
      exeption: err,
    });
  }
};
exports.update = async function (req, res) {
  try {
    const practiceInfo = req.body;
    const practice = await practiceModel.findById(req.params.practice_id);
    if (practice) {
      const result = await practiceModel.updatePractice(practice, practiceInfo);
      res.json({
        success: true,
        practice: result,
      });
    } else {
      res.json({
        success: false,
        message: "Practice not found",
      });
    }
  } catch (err) {
    res.json({
      success: false,
      message: "Update failed",
    });
  }
};
exports.delete = async function (req, res) {
  try {
    await practiceModel.deleteOne({_id: req.params.practice_id});
    res.json({
      success: true,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Delete failed",
    });
  }
};
