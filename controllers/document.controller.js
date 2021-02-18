//Import User Model
const mongoose = require("mongoose");
const documentModel = require("../models/document.model");
//For index
exports.index = async function (req, res) {
  try {
    const options = {
      get_patient: req.query.get_patient,
      get_category: req.query.get_category,
    };
    const documents = await documentModel.get({}, options);
    res.json({
      success: true,
      documents: documents,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Get document list failed",
      exeption: err,
    });
  }
};
exports.practice_document = async function (req, res) {
  try {
    const options = {
      get_patient: req.query.get_patient,
      get_category: req.query.get_category,
    };
    const documents = await documentModel.get({ patient: null }, options);
    res.json({
      success: true,
      documents: documents,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Get practice document list failed",
      exeption: err,
    });
  }
};
exports.patient_document = async function (req, res) {
  const patient_id = req.params.patient_id;
  try {
    const options = {
      get_patient: req.query.get_patient,
      get_category: req.query.get_category,
    };

    const documents = await documentModel.get({ patient: patient_id }, options);
    res.json({
      success: true,
      documents: documents,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Get document list of patient " + patient_id + "failed",
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    let document = new documentModel();
    document.name = req.body.name
      ? req.body.name
      : Date.now().toString("dd/mm/yyyy");
    document.patient = req.body.patient ? req.body.patient : null;
    document.filepath = req.body.filepath ? req.body.filepath : null;
    document.description = req.body.description ? req.body.description : null;
    document.category = req.body.category ? req.body.category : null;
    if (document.filepath == null) {
      return res.json({
        success: false,
        message: "Insert document failed. Require file path",
      });
    }
    const rs = await document.save();
    return res.json({ success: true, document: rs });
  } catch (err) {
    return res.json({
      success: false,
      message: "Insert document failed",
      exeption: err,
    });
  }
};
