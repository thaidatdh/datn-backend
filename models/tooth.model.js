const mongoose = require("mongoose");
const Patient = require("./patient.model");
const ToothSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Types.ObjectId,
      ref: "patient",
      required: true,
    },
    tooth_number: Number,
    tooth_note: String,
    tooth_type: {
      type: String,
      default: "ADULT",
    },
  },
  {
    timestamps: true,
    collection: "tooth",
  }
);

const ToothModel = module.exports = mongoose.model("tooth", ToothSchema);

module.exports.insert = async function (toothInfo) {
  let tooth = new ToothModel();
  tooth.patient = userInfo.patient ? userInfo.patient : null;
  tooth.tooth_number = userInfo.tooth_number ? userInfo.tooth_number : null;
  tooth.tooth_note = userInfo.tooth_note ? userInfo.tooth_note : null;
  tooth.tooth_type = userInfo.tooth_type ? userInfo.tooth_type : null;
  return await tooth.save();
};

module.exports.init_tooth_for_patient = async function (patient_id, tooth_type) {
  let toothList = [];
  for(let tooth_number = 1;tooth_number <=32; tooth_number ++) {
    const toothInfo = {
      patient: patient_id,
      tooth_number: tooth_number,
      tooth_type: tooth_type,
    };
    const insertedTooth = await this.insert(toothInfo);
    toothList.push(insertedTooth);
  }
  return toothList;
};