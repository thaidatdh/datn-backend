//deprecated
const mongoose = require("mongoose");
const constants = require("../constants/constants");
const InsuranceModel = require("../models/patient.insurance.model");
const translator = require("../utils/translator");
//For index
exports.index = async function (req, res) {
  try {
    const options = {
      get_patient: req.query.get_patient == "true",
      get_insurer: req.query.get_insurer == "true",
      limit: req.query.limit,
    };
    const insurances = await InsuranceModel.get({}, options);
    res.json({
      success: true,
      payload: insurances,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "insurance list",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.patient_insurance = async function (req, res) {
  const patient_id = req.params.patient_id;
  try {
    const options = {
      get_patient: req.query.get_patient == "true",
      get_insurer: req.query.get_insurer == "true",
      limit: req.query.limit,
    };

    const insurances = await InsuranceModel.get(
      { patient: patient_id },
      options
    );
    res.json({
      success: true,
      payload: insurances,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "insurance list of patient " + patient_id + "failed",
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
          "insurance failed. Require patient",
          req.query.lang
        ),
      });
    }
    const rs = await InsuranceModel.insert(req.body);
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.INSERT,
        "insurance",
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
      get_insurer: req.query.get_insurer == "true",
      limit: 1,
    };
    const insurance = await InsuranceModel.get(
      { _id: req.params.insurance_id },
      options
    );
    if (insurance && insurance.length > 0) {
      res.json({
        success: true,
        payload: insurance[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage("Insurance", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "detail ",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.update = async function (req, res) {
  try {
    let insurance = await InsuranceModel.findById(req.params.insurance_id);
    if (insurance) {
      const result = await InsuranceModel.updateInsurance(insurance, req.body);
      res.json({
        success: true,
        payload: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage("Insurance", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.UPDATE,
        "Insurance",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.delete = async function (req, res) {
  try {
    const insurance = InsuranceModel.findById(req.params.insurance_id);
    if (insurance) {
      await InsuranceModel.deleteOne({ _id: req.params.insurance_id });
      res.json({
        success: true,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage("Insurance", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.DELETE,
        "Insurance",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
