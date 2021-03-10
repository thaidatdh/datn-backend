//Import User Model
const mongoose = require("mongoose");
const referralSourceModel = require("../models/referral.source.model");
//For index
exports.index = async function (req, res) {
  try {
    const source = await referralSourceModel.find();
    res.json({
      success: true,
      referral_sources: source,
    });
  } catch (err) {
    res.json({
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
    return res.json({ success: true, referral_source: rs });
  } catch (err) {
    return res.json({
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
        referral_source: source,
      });
    } else {
      res.json({
        success: false,
        message: "Referral source not found",
      });
    }
  } catch (err) {
    res.json({
      success: false,
      message: "Update failed",
    });
  }
};
exports.update = async function (req, res) {
  try {
    const sourceInfo = req.body;
    const source = await referralSourceModel.findById(req.params.insurer_id);
    if (source) {
      const result = await referralSourceModel.updateSource(source, sourceInfo);
      res.json({
        success: true,
        referral_source: result,
      });
    } else {
      res.json({
        success: false,
        message: "Referral source not found",
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
    await referralSourceModel.deleteOne({_id: req.params.source_id});
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
