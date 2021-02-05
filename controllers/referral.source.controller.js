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
    let source = new referralSourceModel();
    source.name = req.body.name ? req.body.name : null;
    source.address = req.body.address ? req.body.address : null;
    source.phone = req.body.phone ? req.body.phone : null;
    source.fax = req.body.fax ? req.body.fax : null;
    source.additional_info = req.body.additional_info
      ? req.body.additional_info
      : null;
    const rs = await source.save();
    return res.json({ success: true, referral_source: rs });
  } catch (err) {
    return res.json({
      success: false,
      message: "Insert referral source failed",
      exeption: err,
    });
  }
};
