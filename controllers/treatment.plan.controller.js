//Import User Model
const mongoose = require("mongoose");
const TreatmentPlanModel = require("../models/treatment.plan.model");
const translator = require("../utils/translator");
//For index
exports.index = async function (req, res) {
  try {
    const options = {
      get_patient: req.query.get_patient,
      get_treatment: req.query.get_treatment,
      limit: req.query.limit,
    };
    const plans = await TreatmentPlanModel.get({}, options);
    const result = [...plans];
    if (options.get_treatment) {
      for (let i = 0; i < plans.length; i++) {
        result[i].treatments = [...plans[i].treatments];
      }
    }
    res.json({
      success: true,
      payload: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Get Treatment Plan list failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.patient_treatment_plan = async function (req, res) {
  const patient_id = req.params.patient_id;
  try {
    const options = {
      get_patient: req.query.get_patient,
      get_treatment: req.query.get_treatment,
      limit: req.query.limit,
    };

    const plans = await TreatmentPlanModel.get({ patient: patient_id }, options);
    const result = [...plans];
    if (options.get_treatment) {
      for (let i = 0; i < plans.length; i++) {
        result[i].treatments = [...plans[i].treatments];
      }
    }
    res.json({
      success: true,
      payload: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Get Treatment Plan list of patient " + patient_id + "failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    if (req.body.patient == null) {
      return res.status(400).json({
        success: false,
        message: await translator.Translate("Insert Treatment Plan failed. Require patient", req.query.lang),
      });
    }
    const rs = TreatmentPlanModel.insert(req.body);
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.Translate("Insert Treatment Plan failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.detail = async function (req, res) {
  try {
    const options = {
      get_patient: req.query.get_patient,
      get_treatment: req.query.get_treatment,
    };
    const plans = await TreatmentPlanModel.get({ _id: req.params.plan_id }, options);
    if (plans && plans.length > 0) {
      res.json({
        success: true,
        payload: plans[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.Translate("Treatment Plan not found", req.query.lang),
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
    const plan = await TreatmentPlanModel.findById(req.params.plan_id);
    if (plan) {
      const result = await TreatmentPlanModel.updatePlan(plan, req.body);
      res.json({
        success: true,
        payload: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.Translate("Treatment Plan not found", req.query.lang),
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
    const plan = TreatmentPlanModel.findById(req.params.plan_id);
    if (plan) {
      await TreatmentPlanModel.deleteOne({ _id: req.params.plan_id });
      res.json({
        success: true,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.Translate("Treatment Plan not found", req.query.lang),
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
