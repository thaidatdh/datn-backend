const mongoose = require("mongoose");
const constants = require("../constants/constants");
const Patient = require("./patient.model");
const ToothSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Types.ObjectId,
      ref: "patient",
      required: true,
    },
    tooth_number: Number,
    condition: String,
    tooth_note: String,
    cold: Number,
    percussion: Number,
    palpation: Number,
    heat: Number,
    electricity: Number,
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

const ToothModel = (module.exports = mongoose.model("tooth", ToothSchema));

module.exports.insert = async function (toothInfo) {
  let tooth = new ToothModel();
  tooth.patient = toothInfo.patient ? toothInfo.patient : null;
  tooth.tooth_number = toothInfo.tooth_number ? toothInfo.tooth_number : null;
  tooth.condition = toothInfo.condition ? toothInfo.condition : null;
  tooth.tooth_note = toothInfo.tooth_note ? toothInfo.tooth_note : null;
  tooth.tooth_type = toothInfo.tooth_type
    ? toothInfo.tooth_type
    : constants.TOOTH.DEFAULT_TOOTH_TYPE;
  tooth.cold = constants.TOOTH.TOOTH_STATUS.includes(toothInfo.cold)
    ? toothInfo.cold
    : constants.TOOTH.DEFAULT_TOOTH_STATUS;
  tooth.percussion = constants.TOOTH.TOOTH_STATUS.includes(toothInfo.percussion)
    ? toothInfo.percussion
    : constants.TOOTH.DEFAULT_TOOTH_STATUS;
  tooth.palpation = constants.TOOTH.TOOTH_STATUS.includes(toothInfo.palpation)
    ? toothInfo.palpation
    : constants.TOOTH.DEFAULT_TOOTH_STATUS;
  tooth.heat = constants.TOOTH.TOOTH_STATUS.includes(toothInfo.heat)
    ? toothInfo.heat
    : constants.TOOTH.DEFAULT_TOOTH_STATUS;
  tooth.electricity = constants.TOOTH.TOOTH_STATUS.includes(
    toothInfo.electricity
  )
    ? toothInfo.electricity
    : constants.TOOTH.DEFAULT_TOOTH_STATUS;
  return await tooth.save();
};
module.exports.updateTooth = async function (tooth, toothInfo) {
  if (
    toothInfo.tooth_note == tooth.tooth_note &&
    toothInfo.tooth_type == tooth.tooth_type &&
    tooth.condition == toothInfo.condition
  ) {
    return tooth;
  }
  tooth.tooth_note =
    toothInfo.tooth_note !== undefined
      ? toothInfo.tooth_note
      : tooth.tooth_note;
  tooth.tooth_type = toothInfo.tooth_type
    ? toothInfo.tooth_type
    : tooth.tooth_type;
  tooth.condition = toothInfo.condition ? toothInfo.condition : tooth.condition;
  tooth.cold = constants.TOOTH.TOOTH_STATUS.includes(toothInfo.cold)
    ? toothInfo.cold
    : tooth.cold;
  tooth.percussion = constants.TOOTH.TOOTH_STATUS.includes(toothInfo.percussion)
    ? toothInfo.percussion
    : tooth.percussion;
  tooth.palpation = constants.TOOTH.TOOTH_STATUS.includes(toothInfo.palpation)
    ? toothInfo.palpation
    : tooth.palpation;
  tooth.heat = constants.TOOTH.TOOTH_STATUS.includes(toothInfo.heat)
    ? toothInfo.heat
    : tooth.heat;
  tooth.electricity = constants.TOOTH.TOOTH_STATUS.includes(
    toothInfo.electricity
  )
    ? toothInfo.electricity
    : tooth.electricity;
  return await tooth.save();
};

module.exports.init_tooth_for_patient = async function (
  patient_id,
  tooth_type
) {
  let toothList = [];
  for (let tooth_number = 1; tooth_number <= 32; tooth_number++) {
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
