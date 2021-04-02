//Import User Model
const mongoose = require("mongoose");
const constants = require("../constants/constants");
const referralSourceModel = require("../models/referral.source.model");
const translator = require("../utils/translator");
//For index
exports.index = async function (req, res) {
  try {
    const source = await referralSourceModel.find();
    res.json({
      success: true,
      payload: source,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "referral source list",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    const sourceInfo = req.body;
    const rs = await referralSourceModel.insert(sourceInfo);
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.INSERT,
        "referral source",
        req.query.lang
      ),
      exeption: err,
    });
  }
};

exports.source = async function (req, res) {
  try {
    const source = await referralSourceModel.findById(req.params.source_id);
    if (source) {
      res.json({
        success: true,
        payload: source,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage(
          "Referral source",
          req.query.lang
        ),
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
    const sourceInfo = req.body;
    let source = await referralSourceModel.findById(req.params.source_id);
    if (source) {
      const result = await referralSourceModel.updateSource(source, sourceInfo);
      res.json({
        success: true,
        payload: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage(
          "Referral source",
          req.query.lang
        ),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.UPDATE,
        "Referral source",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.delete = async function (req, res) {
  try {
    await referralSourceModel.deleteOne({ _id: req.params.source_id });
    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.DELETE,
        "Referral Source",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
