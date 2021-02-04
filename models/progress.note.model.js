const mongoose = require('mongoose');
const Patient = require("./patient.model");
const Staff = require("./staff.model");
const ProgressNoteSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Types.ObjectId,
      ref: "patient",
      required: true,
    },
    provider: {
      type: mongoose.Types.ObjectId,
      ref: "staff",
      required: true,
    },
    content: String,
    note_date: Date,
    tooth: String,
    surface: String,
  },
  {
    timestamps: true,
    collection: "progress_note",
  }
);

module.exports = mongoose.model("progress_note", ProgressNoteSchema);