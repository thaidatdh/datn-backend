const mongoose = require('mongoose');
require("./procedure.category.model")

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
      default: 'ADULT',
    }, //Child, Adult
    auto_progress_note: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "procedure_code",
  }
);

module.exports = mongoose.model('procedure_code', ProcedureCodeSchema);