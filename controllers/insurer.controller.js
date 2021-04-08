//deprecated
const mongoose = require("mongoose");
const constants = require("../constants/constants");
const InsurerModel = require("../models/insurer.model");
const translator = require("../utils/translator");
//For index
exports.index = async function (req, res) {
  try {
    const options = {
      limit: req.query.limit,
      page: req.query.page,
    };
    const insurerList = await InsurerModel.get({}, options);
    let result = {
      success: true,
      payload: insurerList,
    };
    if (options.page && options.limit) {
      const totalCount = await drugModel.estimatedDocumentCount();
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
        "insurer list",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
//insert
exports.add = async function (req, res) {
  try {
    const insurerInfo = Object.assign({}, req.body);
    const rs = await InsurerModel.insert(insurerInfo);
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.INSERT,
        "insurer",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.insurer = async function (req, res) {
  try {
    const insurer = await InsurerModel.findById(req.params.insurer_id);
    if (insurer) {
      res.json({
        success: true,
        payload: insurer,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage("Insurer", req.query.lang),
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
    const insurerInfo = req.body;
    let insurer = await InsurerModel.findById(req.params.insurer_id);
    if (insurer) {
      const result = await InsurerModel.updateInsurer(insurer, insurerInfo);
      res.json({
        success: true,
        payload: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage("Insurer", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.UPDATE,
        "Insurer",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.delete = async function (req, res) {
  try {
    await InsurerModel.deleteOne({ _id: req.params.insurer_id });
    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.DELETE,
        "Insurer",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
