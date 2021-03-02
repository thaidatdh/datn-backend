//Import User Model
const mongoose = require("mongoose");
const chairModel = require("../models/chair.model");
const appointmentModel = require("../models/appointment.model");
const blockModel = require("../models/appointment.block.model");
//Chair
exports.chair_index = async function (req, res) {
  try {
    const chairs = await chairModel.find();
    res.json({
      success: true,
      chairs: chairs,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Get chair list failed",
      exeption: err,
    });
  }
};
exports.add_chair = async function (req, res) {
  try {
    let chair = new chairModel();
    chair.name = req.body.name;
    const rs = await chair.save();
    return res.json({ success: true, chair: rs });
  } catch (err) {
    return res.json({
      success: false,
      message: "Insert chair failed",
      exeption: err,
    });
  }
};
//Appointments
exports.appointments_index = async function (req, res) {
  try {
    const appointments = await appointmentModel.get({}, {});
    res.json({
      success: true,
      appointments: appointments,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Get appointment list failed",
      exeption: err,
    });
  }
};
exports.appointments_of_patient = async function (req, res) {
  const patient_id = req.params.patient_id;
  try {
    const appointments = await appointmentModel.get(
      { patient: patient_id },
      {}
    );
    res.json({
      success: true,
      appointments: appointments,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Get appointment list of patient " + patient_id + " failed",
      exeption: err,
    });
  }
};
exports.appointment_info = async function (req, res) {
  const appointment_id = req.params.appointment_id;
  try {
    const appointment = await appointmentModel.getById(appointment_id, {});
    res.json({
      success: true,
      result: appointment,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Get appointment " + appointment_id + " failed",
      exeption: err,
    });
  }
};
exports.add_appointment = async function (req, res) {
  try {
    let apptInfo = req.body;
    const rs = await appointmentModel.insert(apptInfo);
    //link treatment and recall here
    return res.json({ success: true, appointment: rs });
  } catch (err) {
    return res.json({
      success: false,
      message: "Insert appointment failed",
      exeption: err,
    });
  }
};
exports.update_appointment = async function (req, res) {
  try {
    let apptInfo = req.body;
    const rs = await appointmentModel.updateAppt(
      apptInfo,
      req.params.appointment_id
    );
    //link treatment and recall here
    return res.json({ success: true, appointment: rs });
  } catch (err) {
    return res.json({
      success: false,
      message: "Update appointment failed",
      exeption: err,
    });
  }
};
//Appointment Blocks
exports.block_index = async function (req, res) {
  try {
    const blocks = await blockModel.find();
    res.json({
      success: true,
      blocks: blocks,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Get appointment block list failed",
      exeption: err,
    });
  }
};
exports.appointmentblock_info = async function (req, res) {
  const appointment_id = req.params.appointment_block_id;
  try {
    const appointment = await blockModel.findById(appointment_id);
    res.json({
      success: true,
      result: appointment,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Get appointment block " + appointment_id + " failed",
      exeption: err,
    });
  }
};
exports.add_appointmentblock = async function (req, res) {
  try {
    let apptInfo = req.body;
    const rs = await blockModel.insert(apptInfo);
    //link treatment and recall here
    return res.json({ success: true, block: rs });
  } catch (err) {
    return res.json({
      success: false,
      message: "Insert appointment block failed",
      exeption: err,
    });
  }
};
exports.update_appointmentblock = async function (req, res) {
  try {
    let apptInfo = req.body;
    const rs = await blockModel.updateBlock(
      apptInfo,
      req.params.appointment_block_id
    );
    //link treatment and recall here
    return res.json({ success: true, block: rs });
  } catch (err) {
    return res.json({
      success: false,
      message: "Update appointment block failed",
      exeption: err,
    });
  }
};