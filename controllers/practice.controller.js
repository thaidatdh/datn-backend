//Import User Model
const mongoose = require("mongoose");
const practiceModel = require("../models/practice.model");
const translator = require("../utils/translator");
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
      message: await translator.Translate("Get practice list failed", req.query.lang),
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
      message: await translator.Translate("Insert practice failed", req.query.lang),
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
        message: await translator.Translate("Practice not found", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Find practice failed", req.query.lang),
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
        message: await translator.Translate("Practice not found", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message:  await translator.Translate("Update failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.delete = async function (req, res) {
  try {
    await practiceModel.deleteOne({_id: req.params.practice_id});
    res.json({
      success: true,
      message: await translator.Translate("Delete Successfully", req.query.lang),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Delete failed", req.query.lang),
      exeption: err,
    });
  }
};
