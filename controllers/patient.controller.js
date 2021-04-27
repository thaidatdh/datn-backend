//Import User Model
const mongoose = require("mongoose");
const { SEARCH } = require("../constants/constants");
const constants = require("../constants/constants");
const PatientModel = require("../models/patient.model");
const translator = require("../utils/translator");
//For index
exports.index = async function (req, res) {
  try {
    const options = {
      get_hohh: req.query.get_hohh == "true",
      get_provider: req.query.get_provider == "true",
      limit: req.query.limit,
      page: req.query.page,
    };
    const patientList = await PatientModel.get({}, options);
    let result = {
      success: true,
      payload: patientList,
    };
    if (options.page && options.limit) {
      const totalCount = await PatientModel.estimatedDocumentCount();
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
        "patient list",
        req.query.lang
      ),
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
      message: await translator.FailedMessage(
        constants.ACTION.INSERT,
        "patient",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.patient = async function (req, res) {
  try {
    const patient_id = req.params.patient_id;
    const options = {
      get_hohh: req.query.get_hohh == "true",
      get_provider: req.query.get_provider == "true",
    };
    const rs = await PatientModel.get({ _id: patient_id }, options);
    if (rs != null && rs.length > 0) {
      return res.json({ success: true, payload: rs[0] });
    } else {
      return res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage("Patient", req.query.lang),
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "patient faile",
        req.query.lang
      ), //"d",
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
        message: await translator.NotFoundMessage("Patient", req.query.lang),
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.UPDATE,
        "patient",
        req.query.lang
      ),
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
        message: await translator.DeleteMessage(req.query.lang),
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage("Patient", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.DELETE,
        "Patient",
        req.query.lang
      ),
      exeption: err,
    });
  }
};

exports.autocomplete = async function (req, res) {
  let searchType = SEARCH.DEFAULT_AUTO_COMPLETE_PATIENT_TYPE;
  if (
    req.query.type &&
    SEARCH.AUTO_COMPLETE_PATIENT_TYPE.includes(req.query.type)
  ) {
    searchType = req.query.type;
  }
  const limit = req.query.limit
    ? Number.parseInt(req.query.limit)
    : constants.PATIENT.DEFAILT_LIMIT_AUTO_COMPLETE;
  const searchData = req.query.data;
  const regexSearch = {
    $regex: "^" + searchData,
    $options: "i",
  };
  const matchSearch =
    searchType == SEARCH.DEFAULT_AUTO_COMPLETE_PATIENT_TYPE
      ? {
          $or: [{ name: regexSearch }, { last_name: regexSearch }],
        }
      : {
          patient_id: regexSearch,
        };
  try {
    const result = await PatientModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "UserData",
        },
      },
      {
        $unwind: "$UserData",
      },
      {
        $addFields: {
          name: {
            $concat: ["$UserData.first_name", " ", "$UserData.last_name"],
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
        $match: matchSearch,
      },
      {
        $project: {
          _id: 1,
          patient_id: 1,
          first_name: 1,
          last_name: 1,
        },
      },
      { $limit: limit },
    ]);
    res.json({ success: true, payload: result });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "Patient",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
