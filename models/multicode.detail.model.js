const mongoose = require("mongoose");
const constants = require("../constants/constants");

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
MultiCodeDetailSchema.set("toJSON", { virtuals: true });
MultiCodeDetailSchema.set("toObject", { virtuals: true });

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
