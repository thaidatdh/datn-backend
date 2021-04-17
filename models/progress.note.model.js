const mongoose = require("mongoose");
const constants = require("../constants/constants");
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
    title: String,
  },
  {
    timestamps: true,
    collection: "progress_note",
  }
);

const ProgressNoteModel = (module.exports = mongoose.model(
  "progress_note",
  ProgressNoteSchema
));

module.exports.get = async function (query, populateOptions) {
  populateOptions = populateOptions || {};
  const promise = ProgressNoteModel.find(query);
  // Limit
  if (populateOptions.limit && populateOptions.page) {
    promise.skip(
      Number.parseInt(populateOptions.limit) *
        Number.parseInt(populateOptions.page)
    );
  }
  if (populateOptions.limit) {
    promise.limit(Number.parseInt(populateOptions.limit));
  }
  if (populateOptions.get_patient) {
    promise.populate({
      path: "patient",
      populate: {
        path: "user",
        select: {
          _id: 1,
          first_name: 1,
          last_name: 1,
        },
      },
    });
  }
  if (populateOptions.get_provider) {
    promise.populate({
      path: "provider",
      select: {
        staff_type: 1,
        display_id: 1,
        is_active: 1,
        user: 1,
      },
      populate: {
        path: "user",
        select: {
          _id: 1,
          first_name: 1,
          last_name: 1,
        },
      },
    });
  }
  const resultQuery = await promise.exec();
  return resultQuery;
};
module.exports.insert = async function (noteInfo) {
  let note = new ProgressNoteModel();
  note.note_date = noteInfo.note_date
    ? Date.parse(noteInfo.note_date)
    : Date.now();
  note.patient = noteInfo.patient ? noteInfo.patient : null;
  note.provider = noteInfo.provider ? noteInfo.provider : null;
  note.content = noteInfo.content ? noteInfo.content : null;
  note.tooth = noteInfo.tooth ? noteInfo.tooth : null;
  note.surface = noteInfo.surface ? noteInfo.surface : null;
  note.title = noteInfo.title ? noteInfo.title : null;
  return await note.save();
};
module.exports.updateProgressNote = async function (note, noteInfo) {
  note.note_date = noteInfo.note_date
    ? Date.parse(noteInfo.note_date)
    : note.note_date;
  note.patient = noteInfo.patient ? noteInfo.patient : note.patient;
  note.provider = noteInfo.provider ? noteInfo.provider : note.provider;
  note.content = noteInfo.content ? noteInfo.content : note.content;
  note.tooth = noteInfo.tooth ? noteInfo.tooth : note.tooth;
  note.surface = noteInfo.surface ? noteInfo.surface : note.surface;
  note.title = noteInfo.title ? noteInfo.title : note.title;
  return await note.save();
};
