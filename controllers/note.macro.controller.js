//Import User Model
const mongoose = require("mongoose");
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
      message: await translator.Translate("Get note macro list failed", req.query.lang),
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
      message: await translator.Translate("Insert note macro failed", req.query.lang),
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
        message: await translator.Translate("Note Macro not found", req.query.lang),
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
        message: await translator.Translate("Macro not found", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message:  await translator.Translate("Update failed", req.query.lang),
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
      message: await translator.Translate("Delete failed", req.query.lang),
      exeption: err,
    });
  }
};