//Import User Model
const mongoose = require("mongoose");
const InsurerModel = require("../models/insurer.model");
//For index
exports.index = async function (req, res) {
  try {
    const insurerList = await InsurerModel.find();
    res.json({
      success: true,
      payload: insurerList,
    });
  } catch (err) {
    res.status(500).json({
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
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
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
        payload: insurer,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Insurer not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Get failed",
      exeption: err,
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
        payload: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Insurer not found",
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
    await InsurerModel.deleteOne({_id: req.params.insurer_id});
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
