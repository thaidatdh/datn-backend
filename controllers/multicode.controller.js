//Import User Model
const mongoose = require("mongoose");
const constants = require("../constants/constants");
const MultiCodeModel = require("../models/multicode.model");
const translator = require("../utils/translator");
//For index
exports.index = async function (req, res) {
  try {
    const options = {
      get_procedures: req.query.get_procedures == "true",
      limit: req.query.limit,
    };
    const multicodes = await MultiCodeModel.get({}, options);
    res.json({
      success: true,
      payload: multicodes,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "Multi-Code list",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    const rs = await MultiCodeModel.insert(req.body);
    if (rs) {
      return res.json({ success: true, payload: rs });
    } else {
      return res.status(400).json({
        success: false,
        message: await translator.Translate(
          "Insert Multi-Code failed. Require exist Procedure",
          req.query.lang
        ),
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.INSERT,
        "Multi-Code",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.detail = async function (req, res) {
  try {
    const options = {
      get_procedures: req.query.get_procedures == "true",
    };
    const multicodes = await MultiCodeModel.get(
      { _id: req.params.multicode_id },
      options
    );
    if (multicodes && multicodes.length > 0) {
      res.json({
        success: true,
        payload: multicodes[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage("Multi-Code", req.query.lang),
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
