//Import User Model
const mongoose = require("mongoose");
const PatientModel = require("../models/patient.model");
//For index
exports.index = async function (req, res) {
  try {
    const patientList = await PatientModel.get(
      {},
      { get_hohh: true, get_provider: true }
    );
    res.json({
      success: true,
      payload: patientList,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Get patient list failed",
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
      message: "Insert patient failed",
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
        message: "Patient not found",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Get patient failed",
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
        message: "Patient not found",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Update patient failed",
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
        message: "Delete Successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Patient not found",
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
