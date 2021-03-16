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
      payload: documents,
    });
  } catch (err) {
    res.status(500).json({
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
      payload: documents,
    });
  } catch (err) {
    res.status(500).json({
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
      payload: documents,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Get document list of patient " + patient_id + "failed",
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    if (req.body.filepath == null) {
      return res.json({
        success: false,
        message: "Insert document failed. Require file path",
      });
    }
    const rs = await documentModel.insert(req.body);
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Insert document failed",
      exeption: err,
    });
  }
};
exports.detail = async function (req, res) {
  try {
    const document = await documentModel.findById(req.params.document_id);
    if (document) {
      res.json({
        success: true,
        payload: document,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Update failed",
      exeption: err,
    });
  }
};
exports.update = async function (req, res) {
  try {
    const document = await documentModel.findById(req.params.document_id);
    if (document) {
      const result = await documentModel.updateDocument(document, req.body);
      res.json({
        success: true,
        payload: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Update failed",
      exeption: err,
    });
  }
};
exports.delete = async function (req, res) {
  try {
    const document = documentModel.findById(req.params.document_id);
    if (document) {
      await documentModel.deleteOne({ _id: req.params.document_id });
      res.json({
        success: true,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Document not found",
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
