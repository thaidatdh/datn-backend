//Import User Model
const mongoose = require("mongoose");
const RecallModel = require("../models/recall.model");
const translator = require("../utils/translator");
//For index
exports.index = async function (req, res) {
  try {
    const options = {
      get_patient: req.query.get_patient,
      get_treatment: req.query.get_treatment,
      get_appointment: req.query.get_appointment,
      get_procedure: req.query.get_procedure,
      limit: req.query.limit,
    };
    const recall = await RecallModel.get({}, options);
    res.json({
      success: true,
      payload: recall,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Get recall list failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.patient_recall = async function (req, res) {
  const patient_id = req.params.patient_id;
  try {
    const options = {
      get_patient: req.query.get_patient,
      get_treatment: req.query.get_treatment,
      get_appointment: req.query.get_appointment,
      get_procedure: req.query.get_procedure,
      limit: req.query.limit,
    };

    const recalls = await RecallModel.get({ patient: patient_id }, options);
    res.json({
      success: true,
      payload: recalls,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Get recall list of patient " + patient_id + "failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    if (req.body.patient == null) {
      return res.json({
        success: false,
        message: await translator.Translate("Insert recall failed. Require patient", req.query.lang),
      });
    }
    const rs = RecallModel.insert(req.body);
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.Translate("Insert recall failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.detail = async function (req, res) {
  try {
    const recall = await RecallModel.findById(req.params.recall_id);
    if (recall) {
      res.json({
        success: true,
        payload: recall,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.Translate("Recall not found", req.query.lang),
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
    const recall = await RecallModel.findById(req.params.recall_id);
    if (recall) {
      const result = await RecallModel.updateRecall(recall, req.body);
      res.json({
        success: true,
        payload: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.Translate("Recall not found", req.query.lang),
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
    const recall = RecallModel.findById(req.params.recall_id);
    if (recall) {
      await RecallModel.deleteOne({ _id: req.params.recall_id });
      res.json({
        success: true,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.Translate("Recall not found", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Delete failed", req.query.lang),
      exeption: err,
    });
  }
};
