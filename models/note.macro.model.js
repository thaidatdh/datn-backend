const mongoose = require("mongoose");

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

module.exports = mongoose.model("note_macro", NoteMacroSchema);
