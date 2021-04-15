const mongoose = require("mongoose");
const constants = require("../constants/constants");
const { calculateDateRecallByInterval } = require("../utils/utils");
const RecallSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Types.ObjectId,
      ref: "patient",
      required: true,
    },
    treatment: {
      type: mongoose.Types.ObjectId,
      ref: "treatment",
      required: false,
    },
    appointment: {
      type: mongoose.Types.ObjectId,
      ref: "appointment",
      required: false,
    },
    procedure: {
      type: mongoose.Types.ObjectId,
      ref: "procedure_code",
      required: false,
    },
    recall_date: Date,
    is_active: Boolean,
    note: String,
  },
  {
    timestamps: true,
    collection: "recalls",
  }
);

const RecallModel = (module.exports = mongoose.model("recall", RecallSchema));
module.exports.get = async function (query, populateOptions) {
  populateOptions = populateOptions || {};
  const promise = RecallModel.find(query).sort("recall_date");
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
  if (populateOptions.get_patient) {
    promise.populate({
      path: "patient",
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
  if (populateOptions.get_treatment) {
    promise.populate("treatment");
  }
  if (populateOptions.get_appointment) {
    promise.populate("appointment");
  }
  if (populateOptions.get_procedure) {
    promise.populate("procedure");
  }
  const resultQuery = await promise.exec();
  return resultQuery;
};
module.exports.insert = async function (recallInfo) {
  let recall = new RecallModel();
  recall.recall_date = recallInfo.recall_date
    ? Date.parse(recallInfo.recall_date)
    : Date.now();
  recall.patient = recallInfo.patient ? recallInfo.patient : null;
  recall.treatment = recallInfo.treatment ? recallInfo.treatment : null;
  recall.appointment = recallInfo.appointment ? recallInfo.appointment : null;
  recall.procedure = recallInfo.procedure ? recallInfo.procedure : null;
  recall.note = recallInfo.note ? recallInfo.note : null;
  recall.is_active = recallInfo.is_active ? recallInfo.is_active : false;
  return await recall.save();
};
module.exports.insertAutoRecall = async function (autoRecallInfo) {
  let date = calculateDateRecallByInterval(
    autoRecallInfo.treatment_date,
    autoRecallInfo.interval
  );
  let recall = new RecallModel();
  recall.recall_date = date;
  recall.patient = autoRecallInfo.patient;
  recall.treatment = autoRecallInfo.treatment;
  recall.appointment = autoRecallInfo.appointment;
  recall.procedure = autoRecallInfo.procedure;
  recall.note = null;
  recall.is_active = true;
  return await recall.save();
};
module.exports.updateRecall = async function (recall, recallInfo) {
  recall.recall_date = recallInfo.recall_date
    ? Date.parse(recallInfo.recall_date)
    : recall.recall_date;
  recall.patient =
    recallInfo.patient !== undefined ? recallInfo.patient : recall.patient;
  recall.treatment =
    recallInfo.treatment !== undefined
      ? recallInfo.treatment
      : recall.treatment;
  recall.appointment =
    recallInfo.appointment !== undefined
      ? recallInfo.appointment
      : recall.appointment;
  recall.procedure =
    recallInfo.procedure !== undefined
      ? recallInfo.procedure
      : recall.procedure;
  recall.note = recallInfo.note !== undefined ? recallInfo.note : recall.note;
  recall.is_active =
    recallInfo.is_active !== undefined
      ? recallInfo.is_active
      : recall.is_active;
  return await recall.save();
};
module.exports.linkAppt = async function(recall_id, appointment_id) {
  const recall = await RecallModel.findById(recall_id);
  if (recall) {
    recall.appointment = appointment_id;
    return await recall.save();
  }
  return null;
}