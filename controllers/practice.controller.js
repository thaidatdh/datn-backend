//Import User Model
const mongoose = require("mongoose");
const practiceModel = require("../models/practice.model");
//For index
exports.index = async function (req, res) {
  try {
    const practices = await practiceModel.find();
    res.json({
      success: true,
      payload: practices,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Get practice list failed",
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    const practiceInfo = req.body;
    const rs = await practiceModel.insert(practiceInfo);
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Insert practice failed",
      exeption: err,
    });
  }
};
exports.detail = async function (req, res) {
  try {
    console.log(req.params.practice_id);
    const practice = await practiceModel.findById(req.params.practice_id);
    console.log(practice);
    if (practice) {
      res.json({
        success: true,
        payload: practice,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Practice not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Find practice failed",
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
        payload: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Practice not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Update failed",
      exeption: err,
    });
  }
};
exports.delete = async function (req, res) {
  try {
    await practiceModel.deleteOne({_id: req.params.practice_id});
    res.json({
      success: true,
      message: "Delete Successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Delete failed",
      exeption: err,
    });
  }
};
