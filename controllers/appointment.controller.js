//Import User Model
const mongoose = require("mongoose");
const chairModel = require("../models/chair.model");
const appointmentModel = require("../models/appointment.model");
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
    let appointment = new appointmentModel();
    appointment.patient = apptInfo.patient ? apptInfo.patient : null;
    appointment.provider = apptInfo.provider ? apptInfo.provider : null;
    appointment.assistant = apptInfo.assistant ? apptInfo.assistant : null;
    appointment.chair = apptInfo.chair ? apptInfo.chair : null;
    appointment.appointment_date = apptInfo.appointment_date
      ? apptInfo.appointment_date
      : Date.now();
    appointment.appointment_time = apptInfo.appointment_time
      ? apptInfo.appointment_time
      : null;
    appointment.duration = apptInfo.duration ? apptInfo.duration : 15;
    appointment.note = apptInfo.note ? apptInfo.note : null;
    appointment.status = apptInfo.status? apptInfo.status : "NEW";
    const rs = await appointment.save();
    return res.json({ success: true, appointment: rs });
  } catch (err) {
    return res.json({
      success: false,
      message: "Insert appointment failed",
      exeption: err,
    });
  }
};
