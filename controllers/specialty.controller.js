//Import User Model
const mongoose = require("mongoose");
const constants = require("../constants/constants");
const specialtyModel = require("../models/specialty.model");
const translator = require("../utils/translator");
//For index
exports.index = async function (req, res) {
  try {
    const specialty = await specialtyModel.find();
    res.json({
      success: true,
      payload: specialty,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "specialty list",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    let specialty = new specialtyModel();
    specialty.name = req.body.name;
    const rs = await specialty.save();
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.INSERT,
        "specialty",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.specialty = async function (req, res) {
  try {
    const specialty = await specialtyModel.findById(req.params.specialty_id);
    if (specialty) {
      res.json({
        success: true,
        payload: specialty,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage("Specialty", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(constants.ACTION.GET, "detail", req.query.lang),
      exeption: err,
    });
  }
};
exports.update = async function (req, res) {
  try {
    let specialty = await specialtyModel.findById(req.params.specialty_id);
    if (specialty) {
      specialty.name = req.body.name ? req.body.name : specialty.name;
      const result = await specialty.save();
      res.json({
        success: true,
        payload: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage("Specialty", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.UPDATE,
        "Specialty",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.delete = async function (req, res) {
  try {
    await specialtyModel.deleteOne({ _id: req.params.specialty_id });
    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.DELETE,
        "Specialty",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
