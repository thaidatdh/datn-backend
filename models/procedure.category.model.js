const mongoose = require('mongoose');
require("./procedure.code.model")
const ProcedureCategorySchema = mongoose.Schema({
   name: String,
   icon: String,
}, {
   timestamps: true,
   collection: 'procedure_category'
});
ProcedureCategorySchema.virtual("procedure_code", {
  ref: "procedure_code",
  localField: "_id",
  foreignField: "category",
  justOne: false,
});
module.exports = mongoose.model("procedure_category", ProcedureCategorySchema);