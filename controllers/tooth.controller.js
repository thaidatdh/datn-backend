//Import User Model
const mongoose = require("mongoose");
const ToothModel = require("../models/tooth.model");
const translator = require("../utils/translator");
//For index
exports.index = async function (req, res) {
  try {
    const tooth = await ToothModel.find();
    res.json({
      success: true,
      payload: tooth,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Get tooth list failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.patient = async function (req, res) {
  try {
    const tooth = await ToothModel.find({ patient: req.params.patient_id });
    res.json({
      success: true,
      payload: tooth,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Get tooth list of patient failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    const rs = await ToothModel.insert(req.body);
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.Translate("Insert tooth failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.tooth = async function (req, res) {
  try {
    const tooth = await ToothModel.findById(req.params.tooth_id);
    if (tooth) {
      res.json({
        success: true,
        payload: tooth,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.Translate("tooth not found", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Get detail failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.update = async function (req, res) {
  try {
    const tooth = await ToothModel.findById(req.params.tooth_id);
    if (tooth) {
      const result = await ToothModel.updateTooth(tooth, req.body);
      res.json({
        success: true,
        payload: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.Translate("tooth not found", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message:  await translator.Translate("Update failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.delete = async function (req, res) {
  try {
    await ToothModel.deleteOne({ _id: req.params.tooth_id });
    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Delete failed", req.query.lang),
      exeption: err,
    });
  }
};

exports.patient_tooth_by_number = async function (req, res) {
  try {
    const tooth_number = req.params.tooth_number;
    if (tooth_number < 1 || tooth_number > 32) {
      return res.status(400).json({
        success: false,
        message: await translator.Translate("Tooth " + tooth_number + " not valid", req.query.lang),
      });
    }
    const tooth = await ToothModel.find({
      patient: req.params.patient_id,
      tooth_number: tooth_number,
    });
    if (!tooth) {
      const toothInfo = {
        patient: req.params.patient_id,
        tooth_number: tooth_number,
      };
      tooth = await ToothModel.insert(toothInfo);
    }
    res.json({
      success: true,
      payload: tooth,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate(await translator.Translate("Get detail failed", req.query.lang), req.query.lang),
      exeption: err,
    });
  }
};
exports.update_patient_tooth_by_number = async function (req, res) {
  try {
    const tooth_number = req.params.tooth_number;
    if (tooth_number < 1 || tooth_number > 32) {
      return res.status(400).json({
        success: false,
        message: await translator.Translate("Tooth " + tooth_number + " not valid", req.query.lang),
      });
    }
    const tooth = await ToothModel.find({
      patient: req.params.patient_id,
      tooth_number: tooth_number,
    });
    const toothInfo = {
      tooth_type: req.body.tooth_type ? req.body.tooth_type : "ADULT",
      tooth_note: req.body.tooth_note,
    };
    if (tooth) {
      tooth = await ToothModel.updateTooth(tooth, toothInfo);
    } else {
      tooth = await ToothModel.insert(toothInfo);
    }
    res.json({
      success: true,
      payload: tooth,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message:  await translator.Translate("Update failed", req.query.lang),
      exeption: err,
    });
  }
};
