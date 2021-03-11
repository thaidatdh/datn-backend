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
exports.specialist = async function (req, res) {
  try {
    const specialist = await specialistModel.findById(req.params.specialist_id);
    if (specialist) {
      res.json({
        success: true,
        specialist: specialist,
      });
    } else {
      res.json({
        success: false,
        message: "Specialist not found",
      });
    }
  } catch (err) {
    res.json({
      success: false,
      message: "Update failed",
      exeption: err,
    });
  }
};
exports.update = async function (req, res) {
  try {
    const specialist = await specialistModel.findById(req.params.specialist_id);
    if (specialist) {
      specialist.name = req.body.name ? req.body.name : specialist.name;
      const result = await specialist.save();
      res.json({
        success: true,
        specialist: result,
      });
    } else {
      res.json({
        success: false,
        message: "Specialist not found",
      });
    }
  } catch (err) {
    res.json({
      success: false,
      message: "Update failed",
      exeption: err,
    });
  }
};
exports.delete = async function (req, res) {
  try {
    await specialistModel.deleteOne({ _id: req.params.specialist_id });
    res.json({
      success: true,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Delete failed",
      exeption: err,
    });
  }
};