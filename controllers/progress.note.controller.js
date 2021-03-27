//Import User Model
const mongoose = require("mongoose");
const ProgressNoteModel = require("../models/progress.note.model");
const translator = require("../utils/translator");
//For index
exports.index = async function (req, res) {
  try {
    const options = {
      get_patient: req.query.get_patient,
      get_provider: req.query.get_provider,
      limit: req.query.limit,
    };
    const notes = await ProgressNoteModel.get({}, options);
    res.json({
      success: true,
      payload: notes,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Get note list failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.patient_note = async function (req, res) {
  const patient_id = req.params.patient_id;
  try {
    const options = {
      get_patient: req.query.get_patient,
      get_provider: req.query.get_provider,
      limit: req.query.limit,
    };

    const notes = await ProgressNoteModel.get({ patient: patient_id }, options);
    res.json({
      success: true,
      payload: notes,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Get note list of patient " + patient_id + "failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    if (req.body.patient == null) {
      return res.status(400).json({
        success: false,
        message: await translator.Translate("Insert note failed. Require patient", req.query.lang),
      });
    }
    const rs = ProgressNoteModel.insert(req.body);
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.Translate("Insert note failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.detail = async function (req, res) {
  try {
    const options = {
      get_patient: req.query.get_patient,
      get_provider: req.query.get_provider,
    };
    const notes = await ProgressNoteModel.get({ _id: req.params.note_id }, options);
    if (notes && notes.length > 0) {
      res.json({
        success: true,
        payload: notes[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.Translate("Progress Note not found", req.query.lang),
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
    let note = await ProgressNoteModel.findById(req.params.note_id);
    if (note) {
      const result = await ProgressNoteModel.updateProgressNote(note, req.body);
      res.json({
        success: true,
        payload: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.Translate("Progress Note not found", req.query.lang),
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
    const note = ProgressNoteModel.findById(req.params.note_id);
    if (note) {
      await ProgressNoteModel.deleteOne({ _id: req.params.note_id });
      res.json({
        success: true,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.Translate("Progress Note not found", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Delete failed", req.query.lang),
      exeption: err,
    });
  }
};
