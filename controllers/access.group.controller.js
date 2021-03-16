//Import User Model
const mongoose = require("mongoose");
const accessModel = require("../models/access.group.model");
//For index
exports.index = async function (req, res) {
  try {
    const access = await accessModel.find();
    res.json({
      success: true,
      payload: access,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Get access group list failed",
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    const access = new accessModel();
    access.name = req.body.name ? req.body.name : null;
    access.value = req.body.value ? req.body.value : null;
    const rs = await access.save();
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Insert access group failed",
      exeption: err,
    });
  }
};
