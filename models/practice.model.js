const mongoose = require("mongoose");
const constants = require("../constants/constants");
const Staff = require("./staff.model");
const PracticeSchema = mongoose.Schema(
  {
    name: String,
    address: String,
    phone: String,
    fax: String,
    default_provider: {
      type: mongoose.Types.ObjectId,
      ref: "staff",
    },
    start_time: String,
    end_time: String,
  },
  {
    timestamps: true,
    collection: "practice",
  }
);
PracticeSchema.set("toJSON", { virtuals: true });
PracticeSchema.set("toObject", { virtuals: true });

const PracticeModel = (module.exports = mongoose.model(
  "practice",
  PracticeSchema
));
const UpdatePractice = (module.exports.updatePractice = async function (
  practice,
  practiceInfo
) {
  practice.name =
    practiceInfo.name !== undefined ? practiceInfo.name : practice.name;
  practice.address =
    practiceInfo.address !== undefined
      ? practiceInfo.address
      : practice.address;
  practice.phone =
    practiceInfo.phone !== undefined ? practiceInfo.phone : practice.phone;
  practice.fax =
    practiceInfo.fax !== undefined ? practiceInfo.fax : practice.fax;
  practice.default_provider =
    practiceInfo.default_provider !== undefined
      ? practiceInfo.default_provider
      : practice.default_provider;
  practice.start_time = practiceInfo.start_time
    ? practiceInfo.start_time
    : practice.start_time;
  practice.end_time = practiceInfo.end_time
    ? practiceInfo.end_time
    : practice.end_time;
  return await practice.save();
});
module.exports.insert = async function (practiceInfo) {
  let practiceExisted = await PracticeModel.findOne();
  if (practiceExisted) {
    return UpdatePractice(practiceExisted, practiceInfo);
  } else {
    let practice = new PracticeModel();
    practice.name = practiceInfo.name ? practiceInfo.name : null;
    practice.address = practiceInfo.address ? practiceInfo.address : null;
    practice.phone = practiceInfo.phone ? practiceInfo.phone : null;
    practice.fax = practiceInfo.fax ? practiceInfo.fax : null;
    practice.default_provider = practiceInfo.default_provider
      ? practiceInfo.default_provider
      : null;
    practice.start_time = practiceInfo.start_time
      ? practiceInfo.start_time
      : "0700";
    practice.end_time = practiceInfo.end_time ? practiceInfo.end_time : "1700";
    return await practice.save();
  }
};
