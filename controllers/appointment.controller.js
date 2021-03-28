//Import User Model
const mongoose = require("mongoose");
const chairModel = require("../models/chair.model");
const appointmentModel = require("../models/appointment.model");
const blockModel = require("../models/appointment.block.model");
const translator = require("../utils/translator");
const { RANDOM_COLOR } = require("../constants/constants");
//Chair
exports.chair_index = async function (req, res) {
  try {
    const chairs = await chairModel.find().sort("order").exec();
    res.json({
      success: true,
      payload: chairs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Get chair list failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.add_chair = async function (req, res) {
  try {
    let chair = new chairModel();
    chair.name = req.body.name ? req.body.name : null;
    chair.order = req.body.order ? req.body.order : null;
    chair.color = req.body.color ? req.body.color : RANDOM_COLOR();
    chair.is_deleted = req.body.is_deleted ? req.body.is_deleted : false;
    if (chair.name) {
      const rs = await chair.save();
      return res.json({ success: true, payload: rs });
    } else {
      return res.status(400).json({
        success: false,
        message: await translator.Translate("Chair name can not be empty", req.query.lang),
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.Translate("Insert chair failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.chair_info = async function (req, res) {
  const chair_id = req.params.chair_id;
  try {
    const chair = await chairModel.findById(chair_id);
    if (chair) {
      res.json({
        success: true,
        payload: chair,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.Translate("Chair not found", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Get Chair " + chair_id + " failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.update_chair = async function (req, res) {
  const chair_id = req.params.chair_id;
  try {
    let chair = await chairModel.findById(chair_id);
    if (chair) {
      chair.name = req.body.name !== undefined ? req.body.name : chair.name;
      chair.order = req.body.name !== undefined ? req.body.order : chair.order;
      chair.is_deleted =
        req.body.is_deleted !== undefined
          ? req.body.is_deleted
          : chair.is_deleted;
      const result = await chair.save();
      res.json({
        success: true,
        payload: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.Translate("Chair not found", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Get Chair " + chair_id + " failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.delete_chair = async function (req, res) {
  const chair_id = req.params.chair_id;
  try {
    const chair = await chairModel.findById(chair_id);
    if (chair) {
      await chairModel.deleteOne({ _id: chair_id });
      res.json({
        success: true,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.Translate("Chair not found", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Delete Chair " + chair_id + " failed", req.query.lang),
      exeption: err,
    });
  }
};
//Appointments
exports.appointments_index = async function (req, res) {
  try {
    const options = {
      limit: req.query.limit,
    };
    let query = {};
    if (req.query.date) {
      const startDate = new Date(req.query.date);
      const endDate = new Date((new Date(startDate)).setDate(startDate.getDate() + 1));
      query = {
        appointment_date: { $gte: startDate, $lt: endDate },
      };
    }
    const appointments = await appointmentModel.get(query, options);
    res.json({
      success: true,
      payload: appointments,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Get appointment list failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.appointments_of_patient = async function (req, res) {
  const patient_id = req.params.patient_id;
  try {
    const options = {
      limit: req.query.limit,
    };
    const appointments = await appointmentModel.get(
      { patient: patient_id },
      options
    );
    res.json({
      success: true,
      payload: appointments,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("et appointment list of patient " + patient_id + " failed", req.query.lang),//"G",
      exeption: err,
    });
  }
};
exports.appointment_info = async function (req, res) {
  const appointment_id = req.params.appointment_id;
  try {
    const options = {
      limit: req.query.limit,
    };
    const appointment = await appointmentModel.getById(appointment_id, options);
    if (appointment) {
      res.json({
        success: true,
        payload: appointment,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.Translate("Appointment not found", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Get appointment " + appointment_id + " failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.add_appointment = async function (req, res) {
  try {
    let apptInfo = req.body;
    const rs = await appointmentModel.insert(apptInfo);
    //link treatment and recall here
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.Translate("Insert appointment failed", req.query.lang),
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
    if (rs) {
      //link treatment and recall here
      return res.json({ success: true, payload: rs });
    } else {
      return res.status(404).json({
        success: false,
        message: await translator.Translate("Appointment not found", req.query.lang),
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.Translate("Update appointment failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.delete_appointment = async function (req, res) {
  const appointment_id = req.params.appointment_id;
  try {
    const appointment = await appointmentModel.getById(appointment_id, {});
    if (appointment) {
      await appointmentModel.deleteOne({ _id: appointment_id });
      res.json({
        success: true,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.Translate("Appointment not found", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Delete appointment " + appointment_id + " failed", req.query.lang),
      exeption: err,
    });
  }
};
//Appointment Blocks
exports.block_index = async function (req, res) {
  try {
    let query = {};
    if (req.query.date) {
      const startDate = new Date(req.query.date);
      const endDate = new Date(
        new Date(startDate).setDate(startDate.getDate() + 1)
      );
      query = {
        block_date: { $gte: startDate, $lt: endDate },
      };
    }
    const blocks = await blockModel.find(query);
    res.json({
      success: true,
      payload: blocks,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Get appointment block list failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.block_info = async function (req, res) {
  const appointment_id = req.params.appointment_block_id;
  try {
    const block = await blockModel.findById(appointment_id);
    if (block) {
      return res.json({
        success: true,
        payload: block,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: await translator.Translate("Appointment Block not found", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Get appointment block " + appointment_id + " failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.add_block = async function (req, res) {
  try {
    let apptInfo = req.body;
    const rs = await blockModel.insert(apptInfo);
    //link treatment and recall here
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.Translate("Insert appointment block failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.update_block = async function (req, res) {
  try {
    let apptInfo = req.body;
    const rs = await blockModel.updateBlock(
      apptInfo,
      req.params.appointment_block_id
    );
    if (rs) {
      return res.json({ success: true, payload: rs });
    } else {
      return res.status(404).json({
        success: false,
        message: await translator.Translate("Appointment block not found", req.query.lang),
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.Translate("Update appointment block failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.delete_block = async function (req, res) {
  const block_id = req.params.appointment_block_id;
  try {
    const block = await blockModel.findById(block_id);
    if (block) {
      await blockModel.deleteOne({ _id: block_id });
      res.json({
        success: true,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.Translate("Appointment block not found", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Delete appointment block " + block_id + " failed", req.query.lang),
      exeption: err,
    });
  }
};
