const mongoose = require("mongoose");
const constants = require("../constants/constants");
require("./procedure.category.model");

const ProcedureCodeSchema = mongoose.Schema(
  {
    procedure_code: String,
    abbreviation: String,
    description: String,
    procedure_type: String, //TREATMENT, CONDITION
    procedure_fee: mongoose.Types.Decimal128,
    procedure_time: mongoose.Types.Decimal128,
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
      default: "DEFAULT",
    }, //Child, Adult, DEFAULT
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
    : 0;
  proc.procedure_type = procedureCodeInfo.procedure_type
    ? procedureCodeInfo.procedure_type
    : null;
  proc.procedure_time = procedureCodeInfo.procedure_time
    ? procedureCodeInfo.procedure_time
    : 15;
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
module.exports.updateProcedure = async function (procedure, procedureCodeInfo) {
  procedure.procedure_code =
    procedureCodeInfo.procedure_code !== undefined
      ? procedureCodeInfo.procedure_code
      : procedure.procedure_code;
  procedure.abbreviation =
    procedureCodeInfo.abbreviation !== undefined
      ? procedureCodeInfo.abbreviation
      : procedure.abbreviation;
  procedure.description =
    procedureCodeInfo.description !== undefined
      ? procedureCodeInfo.description
      : procedure.description;
  procedure.procedure_type =
    procedureCodeInfo.procedure_type !== undefined
      ? procedureCodeInfo.procedure_type
      : procedure.procedure_type;
  procedure.procedure_fee =
    procedureCodeInfo.procedure_fee !== undefined
      ? procedureCodeInfo.procedure_fee
      : procedure.procedure_fee;
  procedure.procedure_type =
    procedureCodeInfo.procedure_type !== undefined
      ? procedureCodeInfo.procedure_type
      : procedure.procedure_type;
  procedure.procedure_time =
    procedureCodeInfo.procedure_time !== undefined
      ? procedureCodeInfo.procedure_time
      : procedure.procedure_time;
  procedure.category =
    procedureCodeInfo.category !== undefined
      ? procedureCodeInfo.category
      : procedure.category;
  procedure.is_show =
    procedureCodeInfo.is_show != undefined ? procedureCodeInfo.is_show : false;
  procedure.tooth_select =
    procedureCodeInfo.tooth_select !== undefined
      ? procedureCodeInfo.tooth_select
      : procedure.tooth_select;
  procedure.surface_number =
    procedureCodeInfo.surface_number !== undefined
      ? procedureCodeInfo.surface_number
      : procedure.surface_number;
  procedure.mark_type =
    procedureCodeInfo.mark_type !== undefined
      ? procedureCodeInfo.mark_type
      : procedure.mark_type;
  procedure.tooth_type =
    procedureCodeInfo.tooth_type !== undefined
      ? procedureCodeInfo.tooth_type
      : procedure.tooth_type;
  procedure.auto_progress_note =
    procedureCodeInfo.auto_progress_note != undefined
      ? procedureCodeInfo.auto_progress_note
      : procedure.auto_progress_note;
  procedure.auto_recall =
    procedureCodeInfo.auto_recall != undefined
      ? procedureCodeInfo.auto_recall
      : procedure.auto_recall;
  procedure.recall_interval =
    procedureCodeInfo.recall_interval !== undefined
      ? procedureCodeInfo.recall_interval
      : procedure.recall_interval;
  return await procedure.save();
};
module.exports.get = async function (query, populateOptions) {
  populateOptions = populateOptions || {};
  const promise = ProcedureModel.find(query);
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
  const resultQuery = await promise.exec();
  return resultQuery;
};