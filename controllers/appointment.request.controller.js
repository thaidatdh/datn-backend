//Import User Model
const { request } = require("express");
const mongoose = require("mongoose");
const constants = require("../constants/constants");
const ApptRequestModel = require("../models/appointment.request.model");
const translator = require("../utils/translator");
//For index
exports.index = async function (req, res) {
  try {
    const result = await ApptRequestModel.aggregate([
      {
        $lookup: {
          from: "patients",
          localField: "patient",
          foreignField: "_id",
          as: "PatientData",
        },
      },
      {
        $unwind: "$PatientData",
      },
      {
        $lookup: {
          from: "users",
          localField: "PatientData.user",
          foreignField: "_id",
          as: "UserData",
        },
      },
      {
        $unwind: "$UserData",
      },
      {
        $addFields: {
          patient_id: {
            $concat: ["", "$PatientData.patient_id"],
          },
          first_name: {
            $concat: ["$UserData.first_name", ""],
          },
          last_name: {
            $concat: ["", "$UserData.last_name"],
          },
        },
      },
      {
        $match: {
          status: constants.APPOINTMENT_REQUEST.MODE_NEW,
        },
      },
      {
        $project: {
          _id: 1,
          patient: 1,
          patient_id: 1,
          first_name: 1,
          last_name: 1,
          request_date: 1,
          note: 1,
          status: 1,
          createdAt: 1,
        },
      },
    ]);
    res.json({ success: true, payload: result });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "Appointment Request list",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.patient_request = async function (req, res) {
  const patient_id = req.params.patient_id;
  try {
    const options = {
      limit: req.query.limit,
      page: req.query.page,
    };
    let query = { patient: patient_id };
    const requests = await ApptRequestModel.get(query, options);
    let result = {
      success: true,
      payload: requests,
    };
    if (options.page && options.limit) {
      const totalCount = await ApptRequestModel.countDocuments({
        patient: patient_id,
      });
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
        "Appointment Request list of patient " + patient_id + "failed",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    const isCustomizeResult = req.query.customize == "true";
    if (req.body.patient == null) {
      return res.status(403).json({
        success: false,
        message: await translator.Translate(
          "Patient is required",
          req.query.lang
        ),
      });
    }
    if (req.body.request_date == null) {
      return res.status(403).json({
        success: false,
        message: await translator.Translate(
          "Request Date is required",
          req.query.lang
        ),
      });
    }
    const rs = await ApptRequestModel.insert(req.body);
    const resultValue = await ApptRequestModel.get(
      { _id: rs._id },
      { one: true }
    );
    if (resultValue.patient == null) {
      return res.status(404).json({
        success: false,
        message: await translator.Translate(
          "Patient of Request is not found",
          req.query.lang
        ),
      });
    }
    const additionalInfo = {
      patient: resultValue.patient._id,
      patient_id: resultValue.patient.patient_id,
      first_name: resultValue.patient.user.first_name,
      last_name: resultValue.patient.user.last_name,
    };
    const result = Object.assign({}, resultValue._doc, additionalInfo);
    // Notify Appointment Requests socket
    try {
      if (global.socketIO && global.socketUsers) {
        Object.keys(global.socketUsers).forEach((userID) => {
          global.socketIO
            .to(userID)
            .emit("Notify-Appointment-Request-Response", result);
        });
      }
    } catch (e) {}
    return res.json({ success: true, payload: result });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.INSERT,
        "apptRequest",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.apptRequest = async function (req, res) {
  try {
    const resultValue = await ApptRequestModel.get(
      { _id: req.params.request_id },
      { one: true }
    );
    if (resultValue == null) {
      return res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage(
          "Appointment Request",
          req.query.lang
        ),
      });
    }
    if (resultValue.patient == null) {
      return res.status(404).json({
        success: false,
        message: await translator.Translate(
          "Patient of Request is not found",
          req.query.lang
        ),
      });
    }
    const additionalInfo = {
      patient: resultValue.patient._id,
      patient_id: resultValue.patient.patient_id,
      first_name: resultValue.patient.user.first_name,
      last_name: resultValue.patient.user.last_name,
    };
    const apptRequest = Object.assign({}, resultValue._doc, additionalInfo);
    if (apptRequest) {
      res.json({
        success: true,
        payload: apptRequest,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage(
          "Appointment Request",
          req.query.lang
        ),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "Appointment Request",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.update = async function (req, res) {
  try {
    let apptRequest = await ApptRequestModel.findById(req.params.request_id);
    if (apptRequest) {
      const rs = await ApptRequestModel.updateRequest(apptRequest, req.body);
      const resultValue = await ApptRequestModel.get(
        { _id: rs._id },
        { one: true }
      );
      if (resultValue.patient == null) {
        return res.status(404).json({
          success: false,
          message: await translator.Translate(
            "Patient of Request is not found",
            req.query.lang
          ),
        });
      }
      const additionalInfo = {
        patient: resultValue.patient._id,
        patient_id: resultValue.patient.patient_id,
        first_name: resultValue.patient.user.first_name,
        last_name: resultValue.patient.user.last_name,
      };
      const result = Object.assign({}, resultValue._doc, additionalInfo);
      try {
        // Notify Appointment Requests socket
        if (global.socketIO && global.socketUsers) {
          Object.keys(global.socketUsers).forEach((userID) => {
            global.socketIO
              .to(userID)
              .emit("Notify-Update-Appointment-Request-Response", result);
          });
        }
      } catch (e) {}
      return res.json({ success: true, payload: result });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage(
          "Appointment Request",
          req.query.lang
        ),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.UPDATE,
        "Appointment Request",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.delete = async function (req, res) {
  try {
    await ApptRequestModel.updateMany(
      { _id: req.params.request_id },
      { status: constants.APPOINTMENT_REQUEST.MODE_REJECTED }
    );

    try {
      // Notify Appointment Requests socket
      if (global.socketIO && global.socketUsers) {
        Object.keys(global.socketUsers).forEach((userID) => {
          global.socketIO
            .to(userID)
            .emit(
              "Notify-Delete-Appointment-Request-Response",
              req.params.request_id
            );
        });
      }
    } catch (e) {}
    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.DELETE,
        "Appointment Request",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
