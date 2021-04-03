//Import User Model
const mongoose = require("mongoose");
const constants = require("../constants/constants");
const ProgressNoteModel = require("../models/progress.note.model");
const translator = require("../utils/translator");
//For index
exports.index = async function (req, res) {
  try {
    const options = {
      get_patient: req.query.get_patient == "true",
      get_provider: req.query.get_provider == "true",
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
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "note list",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.patient_note = async function (req, res) {
  const patient_id = req.params.patient_id;
  try {
    const options = {
      get_patient: req.query.get_patient == "true",
      get_provider: req.query.get_provider == "true",
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
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "note list of patient " + patient_id + "failed",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    if (req.body.patient == null) {
      return res.status(400).json({
        success: false,
        message: await translator.FailedMessage(
          constants.ACTION.INSERT,
          "note failed. Require patient",
          req.query.lang
        ),
      });
    }
    const rs = ProgressNoteModel.insert(req.body);
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.INSERT,
        "note",
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
      get_provider: req.query.get_provider == "true",
    };
    const notes = await ProgressNoteModel.get(
      { _id: req.params.note_id },
      options
    );
    if (notes && notes.length > 0) {
      res.json({
        success: true,
        payload: notes[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage(
          "Progress Note",
          req.query.lang
        ),
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
        message: await translator.NotFoundMessage(
          "Progress Note",
          req.query.lang
        ),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.UPDATE,
        "Progress Note",
        req.query.lang
      ),
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
        message: await translator.NotFoundMessage(
          "Progress Note",
          req.query.lang
        ),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.DELETE,
        "Progress Note",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
