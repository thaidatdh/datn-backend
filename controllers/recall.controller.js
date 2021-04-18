//Import User Model
const mongoose = require("mongoose");
const constants = require("../constants/constants");
const RecallModel = require("../models/recall.model");
const translator = require("../utils/translator");
//For index
exports.index = async function (req, res) {
  try {
    const options = {
      get_patient: req.query.get_patient == "true",
      get_treatment: req.query.get_treatment == "true",
      get_appointment: req.query.get_appointment == "true",
      get_procedure: req.query.get_procedure == "true",
      limit: req.query.limit,
      page: req.query.page,
    };
    const recall = await RecallModel.get({}, options);
    let result = {
      success: true,
      payload: recalls,
    };
    if (options.page && options.limit) {
      const totalCount = await RecallModel.estimatedDocumentCount();
      const limit = Number.parseInt(options.limit);
      const page = Number.parseInt(options.page);
      result = Object.assign(result, {
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
        "recall list",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.patient_recall = async function (req, res) {
  const patient_id = req.params.patient_id;
  try {
    const options = {
      get_patient: req.query.get_patient == "true",
      get_treatment: req.query.get_treatment == "true",
      get_appointment: req.query.get_appointment == "true",
      get_procedure: req.query.get_procedure == "true",
      limit: req.query.limit,
      page: req.query.page,
    };
    let query = { patient: patient_id };
    if (req.query.date) {
      const fromDate = new Date(req.query.date);
      query = Object.assign(query, {
        recall_date: { $gte: fromDate },
      });
    }
    if (req.query.link == "true") {
      query = Object.assign(query, {
        appointment: null,
      });
    }
    const recalls = await RecallModel.get(query, options);
    let result = {
      success: true,
      payload: recalls,
    };
    if (options.page && options.limit) {
      const totalCount = await RecallModel.countDocuments({
        patient: patient_id,
      });
      const limit = Number.parseInt(options.limit);
      const page = Number.parseInt(options.page);
      result = Object.assign(result, {
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
        "recall list of patient " + patient_id + "failed",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    if (req.body.patient == null) {
      return res.json({
        success: false,
        message: await translator.FailedMessage(
          constants.ACTION.INSERT,
          "recall failed. Require patient",
          req.query.lang
        ),
      });
    }
    const rs = await RecallModel.insert(req.body);
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.INSERT,
        "recall",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.detail = async function (req, res) {
  try {
    const options = {
      get_patient: req.query.get_patient == "true",
      get_treatment: req.query.get_treatment == "true",
      get_appointment: req.query.get_appointment == "true",
      get_procedure: req.query.get_procedure == "true",
    };
    const recall = await RecallModel.get(
      { _id: req.params.recall_id },
      options
    );
    if (recall && recall.length > 0) {
      res.json({
        success: true,
        payload: recall[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage("Recall", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "detail",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.update = async function (req, res) {
  try {
    let recall = await RecallModel.findById(req.params.recall_id);
    if (recall) {
      const result = await RecallModel.updateRecall(recall, req.body);
      res.json({
        success: true,
        payload: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage("Recall", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.UPDATE,
        "Recall",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.delete = async function (req, res) {
  try {
    const recall = RecallModel.findById(req.params.recall_id);
    if (recall) {
      await RecallModel.deleteOne({ _id: req.params.recall_id });
      res.json({
        success: true,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage("Recall", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.DELETE,
        "Recall",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
