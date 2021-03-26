//Import User Model
const mongoose = require("mongoose");
const MultiCodeModel = require("../models/multicode.model");
const translator = require("../utils/translator");
//For index
exports.index = async function (req, res) {
  try {
    const options = {
      get_procedures: req.query.get_patient,
      limit: req.query.limit,
    };
    const multicodes = await MultiCodeModel.get({}, options);
    const result = [...multicodes];
    if (options.get_procedures) {
      for (let i = 0; i < multicodes.length; i++) {
        result[i].procedures = [...multicodes[i].procedures];
      }
    }
    res.json({
      success: true,
      payload: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate(
        "Get Multi-Code list failed",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    const rs = MultiCodeModel.insert(req.body);
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
      message: await translator.Translate(
        "Insert Multi-Code failed",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.detail = async function (req, res) {
  try {
    const options = {
      get_procedures: req.query.get_procedures,
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
        message: await translator.Translate(
          "Multi-Code not found",
          req.query.lang
        ),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Get detail failed", req.query.lang),
      exeption: err,
    });
  }
};
