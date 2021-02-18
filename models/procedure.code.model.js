const mongoose = require("mongoose");
require("./procedure.category.model");

const ProcedureCodeSchema = mongoose.Schema(
  {
    procedure_code: String,
    abbreviation: String,
    description: String,
    procedure_type: String, //TREATMENT, CONDITION
    procedure_fee: mongoose.Types.Decimal128,
    category: {
      type: mongoose.Types.ObjectId,
      ref: "procedure_category",
    },
    is_show: {
      type: Boolean,
      default: false,
    },
    tooth_select: String,
    surface_number: String,
    mark_type: Number,
    tooth_type: {
      type: String,
      default: "ADULT",
    }, //Child, Adult
    auto_progress_note: {
      type: Boolean,
      default: false,
    },
    auto_recall: {
      type: Boolean,
      default: false,
    },
    recall_interval: String,
  },
  {
    timestamps: true,
    collection: "procedure_code",
  }
);

const ProcedureModel = (module.exports = mongoose.model(
  "procedure_code",
  ProcedureCodeSchema
));

module.exports.insert = async function (procedureCodeInfo) {
  let proc = new ProcedureModel();
  proc.procedure_code = procedureCodeInfo.procedure_code
    ? procedureCodeInfo.procedure_code
    : null;
  proc.abbreviation = procedureCodeInfo.abbreviation
    ? procedureCodeInfo.abbreviation
    : null;
  proc.description = procedureCodeInfo.description
    ? procedureCodeInfo.description
    : null;
  proc.procedure_type = procedureCodeInfo.procedure_type
    ? procedureCodeInfo.procedure_type
    : null;
  proc.procedure_fee = procedureCodeInfo.procedure_fee
    ? procedureCodeInfo.procedure_fee
    : null;
  proc.procedure_type = procedureCodeInfo.procedure_type
    ? procedureCodeInfo.procedure_type
    : null;
  proc.category = procedureCodeInfo.category
    ? procedureCodeInfo.category
    : null;
  proc.is_show = procedureCodeInfo.is_show ? procedureCodeInfo.is_show : false;
  proc.tooth_select = procedureCodeInfo.tooth_select
    ? procedureCodeInfo.tooth_select
    : null;
  proc.surface_number = procedureCodeInfo.surface_number
    ? procedureCodeInfo.surface_number
    : null;
  proc.mark_type = procedureCodeInfo.mark_type
    ? procedureCodeInfo.mark_type
    : null;
  proc.tooth_type = procedureCodeInfo.tooth_type
    ? procedureCodeInfo.tooth_type
    : "ADULT";
  proc.auto_progress_note = procedureCodeInfo.auto_progress_note
    ? procedureCodeInfo.auto_progress_note
    : false;
  proc.auto_recall = procedureCodeInfo.auto_recall
    ? procedureCodeInfo.auto_recall
    : false;
  proc.recall_interval = procedureCodeInfo.recall_interval
    ? procedureCodeInfo.recall_interval
    : null;
  return await proc.save();
};
