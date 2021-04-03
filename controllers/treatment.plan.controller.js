//Import User Model
const mongoose = require("mongoose");
const constants = require("../constants/constants");
const TreatmentPlanModel = require("../models/treatment.plan.model");
const translator = require("../utils/translator");
//For index
exports.index = async function (req, res) {
  try {
    const options = {
      get_patient: req.query.get_patient == "true",
      get_treatment: req.query.get_treatment == "true",
      limit: req.query.limit,
      page: req.query.page,
    };
    const plans = await TreatmentPlanModel.get({}, options);
    const resultList = [...plans];
    if (options.get_treatment) {
      for (let i = 0; i < plans.length; i++) {
        resultList[i].treatments = plans[i].treatments;
      }
    }
    let result = {
      success: true,
      payload: resultList,
    };
    if (options.page && options.limit) {
      const totalCount = await TreatmentPlanModel.estimatedDocumentCount();
      const limit = Number.parseInt(options.limit);
      const page = Number.parseInt(options.page);
      result = Object.assign(result, {
        page: page,
        limit: limit,
        total_page: Math.ceil(totalCount / limit),
      });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "Treatment Plan list",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.patient_treatment_plan = async function (req, res) {
  const patient_id = req.params.patient_id;
  try {
    const options = {
      get_patient: req.query.get_patient == "true",
      get_treatment: req.query.get_treatment == "true",
      limit: req.query.limit,
      page: req.query.page,
    };

    const plans = await TreatmentPlanModel.get(
      { patient: patient_id },
      options
    );
    const resultList = [...plans];
    if (options.get_treatment) {
      for (let i = 0; i < plans.length; i++) {
        resultList[i].treatments = plans[i].treatments;
      }
    }
    let result = {
      success: true,
      payload: resultList,
    };
    if (options.page && options.limit) {
      const totalCount = await TreatmentPlanModel.countDocuments({
        patient: patient_id,
      });
      const limit = Number.parseInt(options.limit);
      const page = Number.parseInt(options.page);
      result = Object.assign(result, {
        page: page,
        limit: limit,
        total_page: Math.ceil(totalCount / limit),
      });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "Treatment Plan list of patient " + patient_id + "failed",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    if (req.body.patient == null) {
      return res.status(400).json({
        success: false,
        message: await translator.FailedMessage(
          constants.ACTION.INSERT,
          "Treatment Plan failed. Require patient",
          req.query.lang
        ),
      });
    }
    const rs = TreatmentPlanModel.insert(req.body);
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.INSERT,
        "Treatment Plan",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.detail = async function (req, res) {
  try {
    const options = {
      get_patient: req.query.get_patient == "true",
      get_treatment: req.query.get_treatment == "true",
    };
    const plans = await TreatmentPlanModel.get(
      { _id: req.params.plan_id },
      options
    );
    if (plans && plans.length > 0) {
      const plan = plans[0];
      plan.treatments = plan.treatments;
      res.json({
        success: true,
        payload: plan,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage(
          "Treatment Plan",
          req.query.lang
        ),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(constants.ACTION.GET, "detail", req.query.lang),
      exeption: err,
    });
  }
};
exports.update = async function (req, res) {
  try {
    let plan = await TreatmentPlanModel.findById(req.params.plan_id);
    if (plan) {
      const result = await TreatmentPlanModel.updatePlan(plan, req.body);
      res.json({
        success: true,
        payload: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage(
          "Treatment Plan",
          req.query.lang
        ),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.UPDATE,
        "Treatment Plan",
        req.query.lang
      ),
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
        message: await translator.NotFoundMessage(
          "Treatment Plan",
          req.query.lang
        ),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.DELETE,
        "Treatment Plan",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
