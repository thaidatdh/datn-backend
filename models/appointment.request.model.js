const mongoose = require("mongoose");
const constants = require("../constants/constants");
const Patient = require("./patient.model");
const AppointmentRequestSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Types.ObjectId,
      ref: "patient",
      required: false,
    },
    request_date: Date,
    status: String,
    note: String,
  },
  {
    timestamps: true,
    collection: "appointment_request",
  }
);
AppointmentRequestSchema.set("toJSON", { virtuals: true });
AppointmentRequestSchema.set("toObject", { virtuals: true });

const AppointmentRequestModel = (module.exports = mongoose.model(
  "appointment_request",
  AppointmentRequestSchema
));
module.exports.insert = async function (requestinfo) {
  let request = new AppointmentRequestModel();
  request.request_date = requestinfo.request_date
    ? requestinfo.request_date
    : new Date();
  request.patient = requestinfo.patient ? requestinfo.patient : null;
  request.note = requestinfo.note ? requestinfo.note : null;
  request.status = constants.APPOINTMENT_REQUEST.MODES.includes(
    requestinfo.status
  )
    ? requestinfo.status
    : constants.APPOINTMENT_REQUEST.MODE_NEW;
  return await request.save();
};
module.exports.updateRequest = async function (request, requestinfo) {
  request.request_date = requestinfo.request_date
    ? requestinfo.request_date
    : request.request_date;
  request.patient = requestinfo.patient ? requestinfo.patient : request.patient;
  request.note =
    requestinfo.note !== undefined ? requestinfo.note : request.note;
  request.status = constants.APPOINTMENT_REQUEST.MODES.includes(
    requestinfo.status
  )
    ? requestinfo.status
    : request.status;
  return await request.save();
};
module.exports.get = async function (query, populateOptions) {
  populateOptions = populateOptions || {};
  const promise = populateOptions.one
    ? AppointmentRequestModel.findOne(query)
    : AppointmentRequestModel.find(query);
  promise.populate({
    path: "patient",
    populate: {
      path: "user",
      select: {
        _id: 1,
        password: 0,
      },
    },
  });
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
