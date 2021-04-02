const mongoose = require("mongoose");
const constants = require("../constants/constants");

const NoteMacroSchema = mongoose.Schema(
  {
    content: String,
    note_type: String,
  },
  {
    timestamps: true,
    collection: "note_macro",
  }
);

const NoteMacroModel = (module.exports = mongoose.model(
  "note_macro",
  NoteMacroSchema
));
