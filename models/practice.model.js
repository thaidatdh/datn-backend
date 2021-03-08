const mongoose = require("mongoose");
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
  },
  {
    timestamps: true,
    collection: "practice",
  }
);

const PracticeModel = (module.exports = mongoose.model(
  "practice",
  PracticeSchema
));

module.exports.updatePractice = async function (practiceInfo) {
  let practice = new PracticeModel();
  practice.name = practiceInfo.name ? practiceInfo.name : null;
  practice.address = practiceInfo.address ? practiceInfo.address : null;
  practice.phone = practiceInfo.phone ? practiceInfo.phone : null;
  practice.fax = practiceInfo.fax ? practiceInfo.fax : null;
  practice.default_provider = practiceInfo.default_provider
    ? practiceInfo.default_provider
    : null;
  return await practice.save();
};
module.exports.updatePractice = async function (practice, practiceInfo) {
  practice.name = practiceInfo.name ? practiceInfo.name : null;
  practice.address = practiceInfo.address ? practiceInfo.address : null;
  practice.phone = practiceInfo.phone ? practiceInfo.phone : null;
  practice.fax = practiceInfo.fax ? practiceInfo.fax : null;
  practice.default_provider = practiceInfo.default_provider
    ? practiceInfo.default_provider
    : null;
  return await practice.save();
};
