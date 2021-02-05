const mongoose = require("mongoose");
const Patient = require("./patient.model");
const Staff = require("./staff.model");
const Chair = require("./chair.model");
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
  const promise = StaffModel.find(query);
  promise.populate({
    path: "patient",
    populate: {
      path: "user",
    },
  });
  promise.populate({
    path: "staff",
    populate: {
      path: "user",
    },
  });
  promise.populate("chair");
  // Limit
  if (populateOptions.limit) {
    promise.limit(limit);
  }

  const resultQuery = await promise.exec();
  return resultQuery;
};
module.exports.getById = async function (id, populateOptions) {
  populateOptions = populateOptions || {};
  const promise = StaffModel.findById(id);
  promise.populate({
    path: "patient",
    populate: {
      path: "user",
    },
  });
  promise.populate({
    path: "staff",
    populate: {
      path: "user",
    },
  });
  promise.populate("chair");
  // Limit
  if (populateOptions.limit) {
    promise.limit(limit);
  }

  const resultQuery = await promise.exec();
  return resultQuery;
};