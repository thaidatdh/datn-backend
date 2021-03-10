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
exports.insurer = async function (req, res) {
  try {
    const insurer = await InsurerModel.findById(req.params.insurer_id);
    if (insurer) {
      res.json({
        success: true,
        insurer: insurer,
      });
    } else {
      res.json({
        success: false,
        message: "Insurer not found",
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
    const insurerInfo = req.body;
    const insurer = await InsurerModel.findById(req.params.insurer_id);
    if (insurer) {
      const result = await InsurerModel.updateInsurer(insurer, insurerInfo);
      res.json({
        success: true,
        insurer: result,
      });
    } else {
      res.json({
        success: false,
        message: "Insurer not found",
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
    await InsurerModel.deleteOne({_id: req.params.insurer_id});
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
