//Import User Model
const mongoose = require("mongoose");
const InsurerModel = require("../models/insurer.model");
//For index
exports.index = async function (req, res) {
  try {
    const insurerList = await InsurerModel.find();
    res.json({
      success: true,
      insurers: insurerList,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Get insurer list failed",
      exeption: err,
    });
  }
};
//insert
exports.add = async function (req, res) {
  try {
    const insurerInfo = Object.assign({}, req.body);
    const rs = await InsurerModel.insert(insurerInfo);
    return res.json({ success: true, insurer: rs });
  } catch (err) {
    return res.json({
      success: false,
      message: "Insert insurer failed",
      exeption: err,
    });
  }
};
