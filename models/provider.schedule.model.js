const mongoose = require("mongoose");
const constants = require("../constants/constants");
const Staff = require("./staff.model");
const ProviderScheduleSchema = mongoose.Schema(
  {
    provider: {
      type: mongoose.Types.ObjectId,
      ref: "staff",
      required: true,
    },
    mode: String,
    value: String,
    start_date: Date,
    end_date: Date,
  },
  {
    timestamps: true,
    collection: "provider_schedule",
  }
);
ProviderScheduleSchema.set("toJSON", { virtuals: true });
ProviderScheduleSchema.set("toObject", { virtuals: true });

const ProviderScheduleModel = (module.exports = mongoose.model(
  "provider_schedule",
  ProviderScheduleSchema
));
module.exports.get = async function (query, populateOptions) {
  populateOptions = populateOptions || {};
  const promise =
    populateOptions.one === true
      ? ProviderScheduleModel.findOne(query)
      : ProviderScheduleModel.find(query);
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
  if (populateOptions.get_provider) {
    promise.populate({
      path: "provider",
      select: {
        staff_type: 1,
        display_id: 1,
        is_active: 1,
        user: 1,
      },
      populate: {
        path: "user",
        select: {
          _id: 1,
          first_name: 1,
          last_name: 1,
        },
      },
    });
  }
  const resultQuery = await promise.exec();
  return resultQuery;
};

module.exports.insert = async function (scheduleInfo) {
  let schedule = new ProviderScheduleModel();
  schedule.start_date = scheduleInfo.start_date
    ? Date.parse(scheduleInfo.start_date)
    : null;
  schedule.end_date = scheduleInfo.end_date
    ? Date.parse(scheduleInfo.end_date)
    : schedule.start_date;
  schedule.mode = constants.PROVIDER_SCHEDULE.MODE.includes(scheduleInfo.mode)
    ? scheduleInfo.mode
    : constants.PROVIDER_SCHEDULE.MODE_AUTO;
  schedule.provider = scheduleInfo.provider ? scheduleInfo.provider : null;
  schedule.value = scheduleInfo.value ? scheduleInfo.value : null;
  return await schedule.save();
};
module.exports.updateSchedule = async function (schedule, scheduleInfo) {
  schedule.start_date = scheduleInfo.start_date
    ? Date.parse(scheduleInfo.start_date)
    : schedule.start_date;
  schedule.end_date = scheduleInfo.end_date
    ? Date.parse(scheduleInfo.end_date)
    : schedule.end_date;
  schedule.mode = constants.PROVIDER_SCHEDULE.MODE.includes(scheduleInfo.mode)
    ? scheduleInfo.mode
    : schedule.mode;
  schedule.provider = scheduleInfo.provider
    ? scheduleInfo.provider
    : schedule.provider;
  schedule.value = scheduleInfo.value ? scheduleInfo.value : schedule.value;
  return await schedule.save();
};