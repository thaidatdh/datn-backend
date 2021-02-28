const mongoose = require("mongoose");
const Staff = require("./staff.model");
const Chair = require("./chair.model");
const AppointmentBlockSchema = mongoose.Schema(
  {
    provider: {
      type: mongoose.Types.ObjectId,
      ref: "staff",
      required: true,
    },
    chair: {
      type: mongoose.Types.ObjectId,
      ref: "chair",
      required: true,
    },
    block_date: Date,
    block_time: String,
    duration: String,
    note: String,
    repeat_pattern: String,
    end_date: String,
    block_color: String,
  },
  {
    timestamps: true,
    collection: "appointment_blocks",
  }
);

const AppointmentBlockModel = (module.exports = mongoose.model(
  "appointment_block",
  AppointmentBlockSchema
));
module.exports.insert = async function (apptInfo) {
  let appointment = new AppointmentBlockModel();
  appointment.provider = apptInfo.provider ? apptInfo.provider : null;
  appointment.chair = apptInfo.chair ? apptInfo.chair : null;
  appointment.block_date = apptInfo.block_date ? apptInfo.block_date : null;
  appointment.block_time = apptInfo.block_time ? apptInfo.block_time : null;
  appointment.duration = apptInfo.duration ? apptInfo.duration : null;
  appointment.note = apptInfo.note ? apptInfo.note : null;
  appointment.repeat_pattern = apptInfo.repeat_pattern
    ? apptInfo.repeat_pattern
    : null;
  appointment.end_date = apptInfo.end_date ? apptInfo.end_date : null;
  appointment.block_color = apptInfo.block_color ? apptInfo.block_color : null;
  const rs = await appointment.save();
  return rs;
};
module.exports.updateBlock = async function (apptInfo, appointment_block_id) {
  let appointment = await AppointmentBlockModel.findById(appointment_block_id);
  if (appointment == null) {
    return null;
  }
  appointment.provider = apptInfo.provider
    ? apptInfo.provider
    : appointment.provider;
  appointment.chair = apptInfo.chair ? apptInfo.chair : appointment.chair;
  appointment.block_date = apptInfo.block_date
    ? apptInfo.block_date
    : appointment.block_date;
  appointment.block_time = apptInfo.block_time
    ? apptInfo.block_time
    : appointment.block_time;
  appointment.duration = apptInfo.duration
    ? apptInfo.duration
    : appointment.duration;
  appointment.note = apptInfo.note ? apptInfo.note : appointment.note;
  appointment.repeat_pattern = apptInfo.repeat_pattern
    ? apptInfo.repeat_pattern
    : appointment.repeat_pattern;
  appointment.end_date = apptInfo.end_date
    ? apptInfo.end_date
    : appointment.end_date;
  appointment.block_color = apptInfo.block_color
    ? apptInfo.block_color
    : appointment.block_color;
  const rs = await appointment.save();
  return rs;
};
