//Import User Model
const mongoose = require("mongoose");
const constants = require("../constants/constants");
const documentModel = require("../models/document.model");
const translator = require("../utils/translator");
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
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "document list",
        req.query.lang
      ),
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
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "practice document list",
        req.query.lang
      ),
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
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "document list of patient " + patient_id + "failed",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    if (req.body.filepath == null) {
      return res.json({
        success: false,
        message: await translator.FailedMessage(
          constants.ACTION.INSERT,
          "document failed. Require file path",
          req.query.lang
        ),
      });
    }
    const rs = await documentModel.insert(req.body);
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.INSERT,
        "document",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.detail = async function (req, res) {
  try {
    const options = {
      get_patient: req.query.get_patient,
      get_category: req.query.get_category,
    };
    const document = await documentModel.get(
      { _id: req.params.document_id },
      options
    );
    if (document && document.length > 0) {
      res.json({
        success: true,
        payload: document[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage("Document", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(constants.ACTION.GET, "detail", req.query.lang),
      exeption: err,
    });
  }
};
exports.update = async function (req, res) {
  try {
    let document = await documentModel.findById(req.params.document_id);
    if (document) {
      const result = await documentModel.updateDocument(document, req.body);
      res.json({
        success: true,
        payload: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage("Document", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.UPDATE,
        "Document",
        req.query.lang
      ),
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
        message: await translator.NotFoundMessage("Document", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.DELETE,
        "Document",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
