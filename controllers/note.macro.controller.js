//Import User Model
const mongoose = require("mongoose");
const constants = require("../constants/constants");
const NoteMacroModel = require("../models/note.macro.model");
const translator = require("../utils/translator");
//For index
exports.index = async function (req, res) {
  try {
    const noteMacroList = await NoteMacroModel.find();
    res.json({
      success: true,
      payload: noteMacroList,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "note macro list",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
//insert
exports.add = async function (req, res) {
  try {
    let note = new NoteMacroModel();
    note.content = req.body.content ? req.body.content : null;
    note.note_type = req.body.note_type ? req.body.note_type : null;
    const rs = await note.save();
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.INSERT,
        "note macro",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.detail = async function (req, res) {
  try {
    const macro = await NoteMacroModel.findById(req.params.note_id);
    if (macro) {
      res.json({
        success: true,
        payload: macro,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage("Note Macro", req.query.lang),
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
    let macro = await NoteMacroModel.findById(req.params.note_id);
    if (macro) {
      macro.content = req.body.content !== undefined ? req.body.content : null;
      macro.note_type = req.body.note_type
        ? req.body.note_type
        : macro.note_type;
      const result = await macro.save();
      res.json({
        success: true,
        payload: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage("Macro", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.UPDATE,
        "Macro",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.delete = async function (req, res) {
  try {
    await NoteMacroModel.findByIdAndDelete(req.params.note_id);
    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.DELETE,
        "Macro",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
