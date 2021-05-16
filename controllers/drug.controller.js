//Import User Model
const mongoose = require("mongoose");
const constants = require("../constants/constants");
const drugModel = require("../models/drug.model");
const translator = require("../utils/translator");
//For index
exports.index = async function (req, res) {
  try {
    const options = {
      limit: req.query.limit,
      page: req.query.page,
    };
    const drugs = await drugModel.get({}, options);
    let result = {
      success: true,
      payload: drugs,
    };
    if (options.page && options.limit) {
      const totalCount = await drugModel.estimatedDocumentCount();
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
        "drugs list",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    const drugInfo = req.body;
    const rs = await drugModel.insert(drugInfo);
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.INSERT,
        "drugs",
        req.query.lang
      ),
      exeption: err,
    });
  }
};

exports.drug = async function (req, res) {
  try {
    const drug = await drugModel.findById(req.params.drug_id);
    if (drug) {
      res.json({
        success: true,
        payload: drug,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage("Drug", req.query.lang),
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
    const drugInfo = req.body;
    let drug = await drugModel.findById(req.params.drug_id);
    if (drug) {
      const result = await drugModel.updateDrug(drug, drugInfo);
      res.json({
        success: true,
        payload: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage("Drug", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(constants.ACTION.UPDATE, "Drug", req.query.lang),
      exeption: err,
    });
  }
};
exports.delete = async function (req, res) {
  try {
    await drugModel.deleteOne({ _id: req.params.drug_id });
    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(constants.ACTION.DELETE, "Drug", req.query.lang),
      exeption: err,
    });
  }
};
