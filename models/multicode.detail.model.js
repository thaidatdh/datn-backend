const mongoose = require("mongoose");

const MultiCodeDetailSchema = mongoose.Schema(
  {
    multi_code_id: mongoose.Types.ObjectId,
    procedure: {
      type: mongoose.Types.ObjectId,
      ref: "procedure_code",
    },
  },
  {
    timestamps: true,
    collection: "multi_code_detail",
  }
);

const MultiCodeDetailModel = (module.exports = mongoose.model(
  "multi_code_detail",
  MultiCodeDetailSchema
));

module.exports.insert = async function (multi_code_id, procedure_id) {
  let detail = new MultiCodeDetailModel();
  detail.multi_code_id = multi_code_id ? multi_code_id : null;
  detail.procedure = procedure_id ? procedure_id : null;
  return await detail.save();
};
