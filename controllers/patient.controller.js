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
      patients: patientList,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Get patient list failed",
      exeption: err,
    });
  }
};
//insert
exports.add = async function (req, res) {
  try {
    const rs = await PatientModel.insert(req.body.patient);
    return res.json({ success: true, patient: rs });
  } catch (err) {
    return res.json({
      success: false,
      message: "Insert patient failed",
      exeption: err,
    });
  }
};
