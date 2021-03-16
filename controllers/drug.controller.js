//Import User Model
const mongoose = require("mongoose");
const drugModel = require("../models/drug.model");
//For index
exports.index = async function (req, res) {
  try {
    const drugs = await drugModel.find();
    res.json({
      success: true,
      payload: drugs,
    });
  } catch (err) {
    res.status(500).json({
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
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Insert drugs failed",
      exeption: err,
    });
  }
};

exports.drug = async function (req, res) {
  try {
    const drug = await drugModel.findById(req.params.drug_id);
    if (drug) {
      res.json({
        success: true,
        payload: drug,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Drug not found",
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
    const drugInfo = req.body;
    const drug = await drugModel.findById(req.params.drug_id);
    if (drug) {
      const result = await drugModel.updateDrug(drug, drugInfo);
      res.json({
        success: true,
        payload: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Drug not found",
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
    await drugModel.deleteOne({_id: req.params.drug_id});
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