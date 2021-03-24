//Import User Model
const mongoose = require("mongoose");
const PatientModel = require("../models/patient.model");
const translator = require("../utils/translator");
//For index
exports.index = async function (req, res) {
  try {
    const options = {
      get_hohh: req.query.get_hohh,
      get_provider: req.query.get_provider,
      limit: req.query.limit,
      page: req.query.page
    };
    const patientList = await PatientModel.get(
      {},
      options
    );
    res.json({
      success: true,
      payload: patientList,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Get patient list failed", req.query.lang),
      exeption: err,
    });
  }
};
//insert
exports.add = async function (req, res) {
  try {
    const patientInfo = Object.assign({}, req.body);
    const rs = await PatientModel.insert(patientInfo);
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.Translate("Insert patient failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.patient = async function (req, res) {
  try {
    const patient_id = req.params.patient_id;
    const options = {
      get_hohh: req.query.get_hohh,
      get_provider: req.query.get_provider,
    };
    const rs = await PatientModel.get({ _id: patient_id }, options);
    if (rs != null && rs.length > 0) {
      return res.json({ success: true, payload: rs[0] });
    } else {
      return res.status(404).json({
        success: false,
        message: await translator.Translate("Patient not found", req.query.lang),
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.Translate("Get patient faile", req.query.lang),//"d",
      exeption: err,
    });
  }
};
exports.update = async function (req, res) {
  try {
    const patient_id = req.params.patient_id;
    const patientInfo = Object.assign({}, req.body);
    const rs = await PatientModel.updatePatient(patient_id, patientInfo);
    if (rs) {
      return res.json({ success: true, payload: rs });
    } else {
      return res.status(404).json({
        success: false,
        message: await translator.Translate("Patient not found", req.query.lang),
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.Translate("Update patient failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.delete = async function (req, res) {
  try {
    const patient = await PatientModel.findById(req.params.patient_id);
    if (patient) {
      await PatientModel.deleteOne({ _id: req.params.patient_id });
      await userModel.delete({ _id: patient.user });
      res.json({
        success: true,
        message: await translator.Translate("Delete Successfully", req.query.lang),
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.Translate("Patient not found", req.query.lang),
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
