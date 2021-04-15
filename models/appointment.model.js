const mongoose = require("mongoose");
const constants = require("../constants/constants");
const Patient = require("./patient.model");
const Staff = require("./staff.model");
const Chair = require("./chair.model");
const RecallModel = require("./recall.model");
const TreatmentModel = require("./treatment.model");
const AppointmentSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Types.ObjectId,
      ref: "patient",
      required: true,
    },
    provider: {
      type: mongoose.Types.ObjectId,
      ref: "staff",
      required: true,
    },
    assistant: {
      type: mongoose.Types.ObjectId,
      ref: "staff",
      default: null,
      required: false,
    },
    chair: {
      type: mongoose.Types.ObjectId,
      ref: "chair",
      required: true,
    },
    appointment_date: Date,
    appointment_time: String,
    duration: String,
    note: String,
    status: String, //NEW/CONFIRMED, CHECKOUT,...
  },
  {
    timestamps: true,
    collection: "appointments",
  }
);
AppointmentSchema.virtual("treatments", {
  ref: "treatment",
  localField: "_id",
  foreignField: "appointment",
  justOne: false,
});
const AppointmentModel = (module.exports = mongoose.model(
  "appointment",
  AppointmentSchema
));
module.exports.get = async function (query, populateOptions) {
  populateOptions = populateOptions || {};
  const promise = AppointmentModel.find(query);
  promise.populate({
    path: "patient",
    populate: {
      path: "user",
    },
  });
  promise.populate({
    path: "provider",
    populate: {
      path: "user",
    },
  });
  promise.populate({
    path: "assistant",
    populate: {
      path: "user",
    },
  });
  promise.populate("chair");
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

  const resultQuery = await promise.exec();
  return resultQuery;
};
module.exports.getById = async function (id, populateOptions) {
  populateOptions = populateOptions || {};
  const promise = AppointmentModel.findById(id);
  promise.populate({
    path: "patient",
    populate: {
      path: "user",
    },
  });
  promise.populate({
    path: "provider",
    populate: {
      path: "user",
    },
  });
  promise.populate({
    path: "assistant",
    populate: {
      path: "user",
    },
  });
  promise.populate("chair");
  // Limit
  if (populateOptions.limit) {
    promise.limit(Number.parseInt(populateOptions.limit));
  }

  const resultQuery = await promise.exec();
  return resultQuery;
};

module.exports.insert = async function (apptInfo) {
  let appointment = new AppointmentModel();
  appointment.patient = apptInfo.patient ? apptInfo.patient : null;
  appointment.provider = apptInfo.provider ? apptInfo.provider : null;
  appointment.assistant = apptInfo.assistant ? apptInfo.assistant : null;
  appointment.chair = apptInfo.chair ? apptInfo.chair : null;
  appointment.appointment_date = apptInfo.appointment_date
    ? Date.parse(apptInfo.appointment_date)
    : Date.now();
  appointment.appointment_time = apptInfo.appointment_time
    ? apptInfo.appointment_time
    : null;
  appointment.duration = apptInfo.duration ? apptInfo.duration : 15;
  appointment.note = apptInfo.note ? apptInfo.note : null;
  appointment.status = apptInfo.status ? apptInfo.status : "New";
  const rs = await appointment.save();
  if (apptInfo.recall_link) {
    for (const recallId in apptInfo.recall_link) {
      await RecallModel.linkAppt(recallId, rs._id);
    }
  }
  if (apptInfo.treatment_link){
    for (const treatment_id in apptInfo.treatment_link) {
      await TreatmentModel.linkAppt(treatment_id, rs._id);
    }
  }
  return rs;
};
module.exports.updateAppt = async function (apptInfo, appointment_id) {
  let appointment = await AppointmentModel.findById(appointment_id);
  if (appointment == null) {
    return null;
  }
  appointment.patient =
    apptInfo.patient !== undefined ? apptInfo.patient : appointment.patient;
  appointment.provider =
    apptInfo.provider !== undefined ? apptInfo.provider : appointment.provider;
  appointment.assistant =
    apptInfo.assistant !== undefined
      ? apptInfo.assistant
      : appointment.assistant;
  appointment.chair =
    apptInfo.chair !== undefined ? apptInfo.chair : appointment.chair;
  appointment.appointment_date = apptInfo.appointment_date
    ? Date.parse(apptInfo.appointment_date)
    : appointment.appointment_date;
  appointment.appointment_time =
    apptInfo.appointment_time !== undefined
      ? apptInfo.appointment_time
      : appointment.appointment_time;
  appointment.duration =
    apptInfo.duration !== undefined ? apptInfo.duration : appointment.duration;
  appointment.note =
    apptInfo.note !== undefined ? apptInfo.note : appointment.note;
  appointment.status =
    apptInfo.status !== undefined ? apptInfo.status : appointment.status;
  const rs = await appointment.save();
  if (apptInfo.recall_link) {
    for (const recallId in apptInfo.recall_link) {
      await RecallModel.linkAppt(recallId, rs._id);
    }
  }
  if (apptInfo.treatment_link) {
    for (const treatment_id in apptInfo.treatment_link) {
      await TreatmentModel.linkAppt(treatment_id, rs._id);
    }
  }
  if (apptInfo.recall_unlink) {
    for (const recallId in apptInfo.recall_unlink) {
      await RecallModel.linkAppt(recallId, null);
    }
  }
  if (apptInfo.treatment_unlink) {
    for (const treatment_id in apptInfo.treatment_unlink) {
      await TreatmentModel.linkAppt(treatment_id, null);
    }
  }
  return rs;
};
