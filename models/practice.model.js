const mongoose = require("mongoose");
const constants = require("../constants/constants");
const Staff = require("./staff.model");
const { getDates, isOverlap, formatPhone } = require("../utils/utils");
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
    practiceInfo.phone !== undefined ? formatPhone(practiceInfo.phone) : practice.phone;
  practice.fax =
    practiceInfo.fax !== undefined ? formatPhone(practiceInfo.fax) : practice.fax;
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
    practice.phone = practiceInfo.phone ? formatPhone(practiceInfo.phone) : null;
    practice.fax = practiceInfo.fax ? formatPhone(practiceInfo.fax) : null;
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
module.exports.checkTime = async (date, time, duration) => {
  try {
    if (process.env.DATABASE_DEBUG_SKIP_VALIDATE == "true") {
      return true;
    }
    const practice = await PracticeModel.findOne();
    const dateNewAppt = getDates(date, time, duration);
    const apptStartDate = new Date(dateNewAppt.start);
    const apptEndDate = new Date(dateNewAppt.end);
    const StartPracticeDate = new Date(
      getDates(date, practice.start_time, "0").start
    );

    const isBeforeStart =
      apptStartDate < StartPracticeDate || apptEndDate <= StartPracticeDate;

    if (isBeforeStart) {
      return {
        success: false,
        message: "Appointment can't be start before practice working time",
      };
    }
    const EndPracticeDate = new Date(
      getDates(date, practice.end_time, "0").start
    );
    const isAfterEnd =
      apptEndDate > EndPracticeDate || apptStartDate >= EndPracticeDate;
    if (isAfterEnd) {
      return {
        success: false,
        message: "Appointment can't be end after practice working time",
      };
    }
    return {
      success: true,
      message: "Available",
    };
  } catch (e) {
    return {
      success: false,
      message: "Exception checking Practice time",
    };
  }
};
