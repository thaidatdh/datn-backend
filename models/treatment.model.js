const mongoose = require("mongoose");
const constants = require("../constants/constants");
const { getToothSurface } = require("../utils/utils");
require("./treatment.plan.model");
const Patient = require("./patient.model");
const ProcedureModel = require("./procedure.code.model");
const RecallModel = require("./recall.model");
const ToothModel = require("./tooth.model");
const TreatmentSchema = mongoose.Schema(
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
      required: false,
    },
    procedure_code: {
      type: mongoose.Types.ObjectId,
      ref: "procedure_code",
      required: true,
    },
    treatment_date: Date,
    ada_code: String,
    tooth: String,
    surface: String,
    fee: mongoose.Types.Decimal128,
    //insurance_percent: Number,
    //discount: Number,
    //insurance_amount: Number,
    //patient_amount: Number,
    description: String,
    note: String,
    /*treatment_plan: {
      type: mongoose.Types.ObjectId,
      ref: "treatment_plan",
      required: false,
    },
    appointment: {
      type: mongoose.Types.ObjectId,
      ref: "appointment",
      required: false,
    },*/
    //mark_type: String,
    status: String,
    selected_tooth_raw: mongoose.Schema.Types.Mixed,
    transaction: {
      type: mongoose.Types.ObjectId,
      ref: "transaction",
      required: false,
    },
  },
  {
    timestamps: true,
    collection: "treatments",
  }
);
TreatmentSchema.set("toJSON", { virtuals: true });
TreatmentSchema.set("toObject", { virtuals: true });

const TreatmentModel = (module.exports = mongoose.model(
  "treatment",
  TreatmentSchema
));
module.exports.get = async function (query, populateOptions) {
  populateOptions = populateOptions || {};
  const promise = TreatmentModel.find(query).sort({ treatment_date: -1 });
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
  /*if (populateOptions.get_plan) {
    promise.populate({
      path: "treatment_plan",
      select: { _id: 1, name: 1, description: 1 },
    });
  }*/
  if (populateOptions.get_procedure) {
    promise.populate({
      path: "procedure_code",
    });
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
  if (populateOptions.get_staff) {
    promise.populate({
      path: "assistant",
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
module.exports.insert = async function (req) {
  const Procedure = await ProcedureModel.findById(req.procedure_code);
  if (!Procedure) {
    return null;
  }
  let treatment = new TreatmentModel();
  treatment.treatment_date = req.treatment_date
    ? Date.parse(req.treatment_date)
    : Date.now();
  treatment.patient = req.patient ? req.patient : null;
  treatment.assistant = req.assistant ? req.assistant : null;
  treatment.provider = req.provider ? req.provider : null;
  treatment.procedure_code = req.procedure_code ? req.procedure_code : null;
  treatment.tooth = req.tooth ? req.tooth : null;
  treatment.surface = req.surface ? req.surface : null;
  treatment.note = req.note ? req.note : null;
  //treatment.treatment_plan = req.treatment_plan ? req.treatment_plan : null;
  treatment.appointment = req.appointment ? req.appointment : null;
  treatment.status = req.status ? req.status : "PLAN";
  treatment.ada_code = req.ada_code ? req.ada_code : Procedure.procedure_code;
  treatment.fee = req.fee ? req.fee : Procedure.procedure_fee;
  treatment.description = req.description
    ? req.description
    : Procedure.description;
  //treatment.mark_type = req.mark_type ? req.mark_type : Procedure.mark_type;
  treatment.selected_tooth_raw = req.selected_tooth_raw
    ? req.selected_tooth_raw
    : null;
  if (req.selected_tooth_raw) {
    const toothSurface = getToothSurface(req.selected_tooth_raw);
    treatment.tooth = toothSurface.tooth;
    treatment.surface = toothSurface.surface;
  }
  const treatmentResult = await treatment.save();
  if (
    Procedure.auto_recall === true &&
    Procedure.recall_interval != null &&
    Procedure.recall_interval !== constants.RECALL.DEFAULT_INTERVAL
  ) {
    const autoRecallInfo = {
      patient: treatmentResult.patient,
      treatment_date: treatmentResult.treatment_date,
      interval: Procedure.recall_interval,
      appointment: treatmentResult.appointment,
      procedure: treatmentResult.procedure_code,
      treatment: treatmentResult._id,
    };
    try {
      await RecallModel.insertAutoRecall(autoRecallInfo);
    } catch (errorRecall) {
      console.log(errorRecall);
    }
  }
  await Patient.updateBalance(
    treatment.patient,
    treatment.fee,
    constants.TRANSACTION.INCREASE
  );
  if (Procedure.description == "Missing" && treatment.status !== "CANCEL") {
    try {
      const toothNumber = parseInt(treatment.tooth);
      await ToothModel.updateOne(
        { patient: treatment.patient, tooth_number: toothNumber },
        { condition: "MISSING" }
      );
    } catch (error) {}
  }
  return treatmentResult;
};
module.exports.updateTreatment = async function (treatment, req) {
  treatment.treatment_date = req.treatment_date
    ? Date.parse(req.treatment_date)
    : treatment.treatment_date;
  treatment.assistant =
    req.assistant !== undefined ? req.assistant : treatment.assistant;
  treatment.provider =
    req.provider !== undefined ? req.provider : treatment.provider;
  treatment.tooth = req.tooth !== undefined ? req.tooth : treatment.tooth;
  treatment.surface =
    req.surface !== undefined ? req.surface : treatment.surface;
  treatment.note = req.note !== undefined ? req.note : treatment.note;
  /*treatment.treatment_plan =
    req.treatment_plan !== undefined
      ? req.treatment_plan
      : treatment.treatment_plan;*/
  treatment.appointment =
    req.appointment !== undefined ? req.appointment : treatment.appointment;
  treatment.status = req.status ? req.status : treatment.status;
  treatment.selected_tooth_raw = req.selected_tooth_raw
    ? req.selected_tooth_raw
    : treatment.selected_tooth_raw;
  if (req.selected_tooth_raw) {
    const toothSurface = getToothSurface(req.selected_tooth_raw);
    treatment.tooth = toothSurface.tooth;
    treatment.surface = toothSurface.surface;
  }
  if (treatment.description == "Missing") {
    try {
      const toothNumber = parseInt(treatment.tooth);
      if (treatment.status !== "CANCEL")
        await ToothModel.updateOne(
          { patient: treatment.patient, tooth_number: toothNumber },
          { condition: "MISSING" }
        );
      else {
        await ToothModel.updateOne(
          { patient: treatment.patient, tooth_number: toothNumber },
          { condition: null }
        );
      }
    } catch (error) {}
  }
  return await treatment.save();
};
module.exports.linkAppt = async function (treatment_id, appointment_id) {
  const treatment = await TreatmentModel.findById(treatment_id);
  if (treatment) {
    treatment.appointment = appointment_id;
    return await treatment.save();
  }
  return null;
};
