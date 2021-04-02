//Import User Model
const mongoose = require("mongoose");
const constants = require("../constants/constants");
const practiceModel = require("../models/practice.model");
const translator = require("../utils/translator");
//For index
exports.index = async function (req, res) {
  try {
    const practices = await practiceModel.findOne();
    res.json({
      success: true,
      payload: practices,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "practice",
        req.query.lang
      ),
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
      message: await translator.FailedMessage(
        constants.ACTION.INSERT,
        "practice",
        req.query.lang
      ),
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
        message: await translator.NotFoundMessage("Practice", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "practice",
        req.query.lang
      ),
      exeption: err,
    });
  }
};

exports.update = async function (req, res) {
  try {
    const practiceInfo = req.body;
    let practice = await practiceModel.findById(req.params.practice_id);
    if (practice) {
      const result = await practiceModel.updatePractice(practice, practiceInfo);
      res.json({
        success: true,
        payload: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage("Practice", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.UPDATE,
        "Practice",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.delete = async function (req, res) {
  try {
    await practiceModel.deleteOne({ _id: req.params.practice_id });
    res.json({
      success: true,
      message: await translator.DeleteMessage(req.query.lang),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.DELETE,
        "Practice",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
