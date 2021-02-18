//Import User Model
const mongoose = require("mongoose");
const drugModel = require("../models/drug.model");
//For index
exports.index = async function (req, res) {
  try {
    const drugs = await drugModel.find();
    res.json({
      success: true,
      drugs: drugs,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Get drugs list failed",
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    const drugInfo = req.body;
    const rs = await drugModel.insert(drugInfo);
    return res.json({ success: true, drug: rs });
  } catch (err) {
    return res.json({
      success: false,
      message: "Insert drugs failed",
      exeption: err,
    });
  }
};
