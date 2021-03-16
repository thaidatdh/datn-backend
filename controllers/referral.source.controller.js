//Import User Model
const mongoose = require("mongoose");
const referralSourceModel = require("../models/referral.source.model");
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
      message: "Get referral source list failed",
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
      message: "Insert referral source failed",
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
        message: "Referral source not found",
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
exports.update = async function (req, res) {
  try {
    const sourceInfo = req.body;
    const source = await referralSourceModel.findById(req.params.source_id);
    if (source) {
      const result = await referralSourceModel.updateSource(source, sourceInfo);
      res.json({
        success: true,
        payload: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Referral source not found",
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
    await referralSourceModel.deleteOne({_id: req.params.source_id});
    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Delete failed",
      exeption: err,
    });
  }
};
