//Import User Model
const mongoose = require("mongoose");
const NoteMacroModel = require("../models/note.macro.model");
//For index
exports.index = async function (req, res) {
  try {
    const noteMacroList = await NoteMacroModel.find();
    res.json({
      success: true,
      notes: noteMacroList,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Get note macro list failed",
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
    return res.json({ success: true, note: rs });
  } catch (err) {
    return res.json({
      success: false,
      message: "Insert note macro failed",
      exeption: err,
    });
  }
};
