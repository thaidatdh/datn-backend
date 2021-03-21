//Import User Model
const mongoose = require("mongoose");
const InsuranceModel = require("../models/patient.insurance.model");
//For index
exports.index = async function (req, res) {
  try {
    const options = {
      get_patient: req.query.get_patient,
      get_insurer: req.query.get_insurer,
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
      message: "Get insurance list failed",
      exeption: err,
    });
  }
};
exports.patient_insurance = async function (req, res) {
  const patient_id = req.params.patient_id;
  try {
    const options = {
      get_patient: req.query.get_patient,
      get_insurer: req.query.get_insurer,
      limit: req.query.limit,
    };

    const insurances = await InsuranceModel.get({ patient: patient_id }, options);
    res.json({
      success: true,
      payload: insurances,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Get insurance list of patient " + patient_id + "failed",
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    if (req.body.patient == null) {
      return res.status(400).json({
        success: false,
        message: "Insert insurance failed. Require patient",
      });
    }
    const rs = InsuranceModel.insert(req.body);
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Insert insurance failed",
      exeption: err,
    });
  }
};
exports.detail = async function (req, res) {
  try {
    const insurance = await InsuranceModel.findById(req.params.insurance_id);
    if (insurance) {
      res.json({
        success: true,
        payload: insurance,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Insurance not found",
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
    const insurance = await InsuranceModel.findById(req.params.insurance_id);
    if (insurance) {
      const result = await InsuranceModel.updateInsurance(insurance, req.body);
      res.json({
        success: true,
        payload: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Insurance not found",
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
    const insurance = InsuranceModel.findById(req.params.insurance_id);
    if (insurance) {
      await InsuranceModel.deleteOne({ _id: req.params.insurance_id });
      res.json({
        success: true,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Insurance not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Delete failed",
      exeption: err,
    });
  }
};
