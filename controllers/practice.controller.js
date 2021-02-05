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
    let practice = new practiceModel();
    practice.name = req.body.name ? req.body.name : null;
    practice.address = req.body.address ? req.body.address : null;
    practice.phone = req.body.phone ? req.body.phone : null;
    practice.fax = req.body.fax ? req.body.fax : null;
    practice.default_provider = req.body.default_provider
      ? req.body.default_provider
      : null;
    const rs = await practice.save();
    return res.json({ success: true, practice: rs });
  } catch (err) {
    return res.json({
      success: false,
      message: "Insert practice failed",
      exeption: err,
    });
  }
};
