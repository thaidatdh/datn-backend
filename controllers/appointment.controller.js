//Import User Model
const mongoose = require("mongoose");
const constants = require("../constants/constants");
const chairModel = require("../models/chair.model");
const PracticeModel = require("../models/practice.model");
const appointmentModel = require("../models/appointment.model");
const treatmentModel = require("../models/treatment.model");
const recallModel = require("../models/recall.model");
const blockModel = require("../models/appointment.block.model");
const ProviderScheduleModel = require("../models/provider.schedule.model");
const translator = require("../utils/translator");
const { RANDOM_COLOR } = require("../constants/constants");
const { formatReadableDate } = require("../utils/utils");
//Chair
exports.chair_index = async function (req, res) {
  try {
    const chairs = await chairModel
      .find({ is_deleted: false })
      .sort("order")
      .exec();
    res.json({
      success: true,
      payload: chairs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "chair list",
        req.query.lang
      ),
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
        message: await translator.Translate(
          "Chair name can not be empty",
          req.query.lang
        ),
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.INSERT,
        "chair",
        req.query.lang
      ),
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
        message: await translator.NotFoundMessage("Chair", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "Chair " + chair_id,
        req.query.lang
      ),
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
        message: await translator.NotFoundMessage("Chair", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "Chair " + chair_id,
        req.query.lang
      ),
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
        message: await translator.NotFoundMessage("Chair", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.UPDATE,
        "Chair " + chair_id,
        req.query.lang
      ),
      exeption: err,
    });
  }
};
//Appointments
exports.appointments_index = async function (req, res) {
  try {
    const options = {
      get_treatments: req.query.get_treatments == "true",
      get_recalls: req.query.get_recalls == "true",
      limit: req.query.limit,
      page: req.query.page,
    };
    let query = {};
    if (req.query.date) {
      const startDate = new Date(req.query.date);
      const endDate = new Date(
        new Date(startDate).setDate(startDate.getDate() + 1)
      );
      query = {
        appointment_date: { $gte: startDate, $lt: endDate },
      };
    }
    if (
      req.query.active_chair_only &&
      String(req.query.active_chair_only).toLowerCase() == "true"
    ) {
      const chairs = await chairModel
        .find({ is_deleted: false })
        .select("_id")
        .sort("order")
        .exec();
      let chairsList = [];
      for (const chair of chairs) {
        chairsList.push(chair._id);
      }
      query = Object.assign(query, { chair: { $in: chairsList } });
    }
    const appointments = await appointmentModel.get(query, options);

    let result = {
      success: true,
      payload: appointments,
    };
    if (options.page && options.limit) {
      const totalCount =
        query == {}
          ? await appointmentModel.estimatedDocumentCount()
          : await appointmentModel.countDocuments(query);
      const limit = Number.parseInt(options.limit);
      const page = Number.parseInt(options.page);
      result = Object.assign(result, {
        total: totalCount,
        page: page,
        limit: limit,
        total_page: Math.ceil(totalCount / limit),
      });
    }
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "appointment list",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.appointments_of_patient = async function (req, res) {
  const patient_id = req.params.patient_id;
  try {
    const options = {
      get_treatments: req.query.get_treatments == "true",
      get_recalls: req.query.get_recalls == "true",
      page: req.query.page,
      limit: req.query.limit,
    };
    let query = { patient: patient_id };
    if (req.query.date) {
      const startDate = new Date(req.query.date);
      query = Object.assign(query, {
        appointment_date: { $gte: startDate },
      });
    }
    if (req.query.from && req.query.to) {
      const startDate = new Date(req.query.from);
      const endDate = new Date(req.query.to);
      query = Object.assign(query, {
        appointment_date: { $gte: startDate, $lte: endDate },
      });
    }
    const appointments = await appointmentModel.get(query, options);
    let resultArray = [];
    for (const appt of appointments) {
      let appointmentObject = Object.assign({}, appt._doc);
      appointmentObject.treatments = appt.treatments;
      appointmentObject.recalls = appt.recalls;
      if (
        options.get_treatments == true &&
        appt.treatments &&
        appt.treatments.length > 0
      ) {
        appointmentObject.service_name = appt.treatments[0].description;
      } else if (options.get_treatments == false) {
        appointmentObject.service_name = await appointmentModel.getFirstTreatmentDescription(
          appt._id
        );
      } else {
        appointmentObject.service_name = null;
      }
      resultArray.push(appointmentObject)
    }
    let result = {
      success: true,
      payload: resultArray,
    };
    if (options.page && options.limit) {
      const totalCount = await appointmentModel.countDocuments(query);
      const limit = Number.parseInt(options.limit);
      const page = Number.parseInt(options.page);
      result = Object.assign(result, {
        total: totalCount,
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
        "appointment list of patient " + patient_id,
        req.query.lang
      ), //"G",
      exeption: err,
    });
  }
};
exports.appointment_info = async function (req, res) {
  const appointment_id = req.params.appointment_id;
  try {
    const options = {
      limit: req.query.limit,
      get_treatments: req.query.get_treatments == "true",
      get_recalls: req.query.get_recalls == "true",
    };
    const appointment = await appointmentModel.getById(appointment_id, options);
    if (appointment) {
      let appointmentObject = Object.assign({}, appointment._doc);
      if (
        options.get_treatments == true &&
        appointment.treatments &&
        appointment.treatments.length > 0
      ) {
        appointmentObject.service_name = appointment.treatments[0].description;
      } else if (options.get_treatments == false) {
        appointmentObject.service_name = await appointmentModel.getFirstTreatmentDescription(
          appointment._id
        );
      } else {
        appointmentObject.service_name = null;
      }
      res.json({
        success: true,
        payload: appointmentObject,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage(
          "Appointment",
          req.query.lang
        ),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "appointment " + appointment_id,
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.add_appointment = async function (req, res) {
  try {
    let apptInfo = Object.assign({}, req.body);
    if (apptInfo.provider == null) {
      apptInfo.provider = req.default_provider_id;
    }
    let missingRequiredParams = [];
    if (apptInfo.patient == null) {
      missingRequiredParams.push("patient");
    }
    if (apptInfo.provider == null) {
      missingRequiredParams.push("provider");
    }
    if (apptInfo.appointment_date == null) {
      missingRequiredParams.push("appointment_date");
    }
    if (apptInfo.appointment_time == null) {
      missingRequiredParams.push("appointment_time");
    }
    if (apptInfo.duration == null) {
      missingRequiredParams.push("duration");
    }
    if (apptInfo.chair == null) {
      missingRequiredParams.push("chair");
    }
    if (missingRequiredParams.length > 0) {
      return res.status(403).json({
        success: false,
        message: await translator.Translate(
          "Missing Required Fields",
          req.query.lang
        ),
        params: missingRequiredParams,
      });
    }
    const isProviderAvailable = await ProviderScheduleModel.isProviderAvailable(
      apptInfo.provider,
      apptInfo.appointment_date
    );
    if (isProviderAvailable == false) {
      return res.status(403).json({
        success: false,
        message: await translator.Translate(
          "Provider is not working at " +
            formatReadableDate(apptInfo.appointment_date),
          req.query.lang
        ),
      });
    }
    const practiceCheckResult = await PracticeModel.checkTime(
      apptInfo.appointment_date,
      apptInfo.appointment_time,
      apptInfo.duration
    );
    if (practiceCheckResult.success == false) {
      return res.status(403).json({
        success: false,
        message: await translator.Translate(
          practiceCheckResult.message,
          req.query.lang
        ),
        param: "duration",
      });
    }
    const availableCheckResult = await appointmentModel.checkAvailable(
      apptInfo.provider,
      apptInfo.chair,
      apptInfo.appointment_date,
      apptInfo.appointment_time,
      apptInfo.duration
    );
    if (availableCheckResult.available == false) {
      return res.status(403).json({
        success: false,
        message: await translator.Translate(
          availableCheckResult.message,
          req.query.lang
        ),
        param: availableCheckResult.param,
      });
    }
    let rs = await appointmentModel.insert(apptInfo);
    let returnValue = await appointmentModel.getById(rs._id, {
      //get_treatments: true,
      //get_recalls: true,
    });
    return res.json({ success: true, payload: returnValue });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.INSERT,
        "appointment",
        req.query.lang
      ),
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
      let returnValue = await appointmentModel.getById(rs._id, {});
      return res.json({ success: true, payload: returnValue });
    } else {
      return res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage(
          "Appointment",
          req.query.lang
        ),
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.UPDATE,
        "appointment",
        req.query.lang
      ),
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
      await treatmentModel.updateMany(
        { appointment: appointment_id },
        { $set: { appointment: null } }
      );
      await recallModel.updateMany(
        { appointment: appointment_id },
        { $set: { appointment: null } }
      );
      res.json({
        success: true,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage(
          "Appointment",
          req.query.lang
        ),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.UPDATE,
        "appointment " + appointment_id,
        req.query.lang
      ),
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
    if (
      req.query.active_chair_only &&
      String(req.query.active_chair_only).toLowerCase() == "true"
    ) {
      const chairs = await chairModel
        .find({ is_deleted: false })
        .select("_id")
        .sort("order")
        .exec();
      let chairsList = [];
      for (const chair of chairs) {
        chairsList.push(chair._id);
      }
      query = Object.assign(query, { chair: { $in: chairsList } });
    }
    const blocks = await blockModel.find(query);
    res.json({
      success: true,
      payload: blocks,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "appointment block list",
        req.query.lang
      ),
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
        message: await translator.NotFoundMessage(
          "Appointment Block",
          req.query.lang
        ),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "appointment block " + appointment_id,
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.add_block = async function (req, res) {
  try {
    let apptInfo = req.body;
    if (apptInfo.provider == null) {
      apptInfo.provider = req.default_provider_id;
    }
    const rs = await blockModel.insert(apptInfo);
    //link treatment and recall here
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.INSERT,
        "appointment block",
        req.query.lang
      ),
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
        message: await translator.NotFoundMessage(
          "Appointment block",
          req.query.lang
        ),
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.UPDATE,
        "appointment block",
        req.query.lang
      ),
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
        message: await translator.NotFoundMessage(
          "Appointment block",
          req.query.lang
        ),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.UPDATE,
        "appointment block " + block_id,
        req.query.lang
      ),
      exeption: err,
    });
  }
};
