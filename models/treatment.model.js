const mongoose = require("mongoose");
const constants = require("../constants/constants");
require("./treatment.plan.model");
const Patient = require("./patient.model");
const Staff = require("./staff.model");
const ProcedureModel = require("./procedure.code.model");
const Appointment = require("./appointment.model");
const RecallModel = require("./recall.model");
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
    treatment_plan: {
      type: mongoose.Types.ObjectId,
      ref: "treatment_plan",
      required: false,
    },
    appointment: {
      type: mongoose.Types.ObjectId,
      ref: "appointment",
      required: false,
    },
    mark_type: String,
    status: String,
  },
  {
    timestamps: true,
    collection: "treatments",
  }
);

const TreatmentModel = (module.exports = mongoose.model(
  "treatment",
  TreatmentSchema
));
module.exports.get = async function (query, populateOptions) {
  populateOptions = populateOptions || {};
  const promise = TreatmentModel.find(query);
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
  if (populateOptions.get_plan) {
    promise.populate({
      path: "treatment_plan",
      select: { _id: 1, name: 1, description: 1 },
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
  //treatment.discount = req.discount ? req.discount : 0;
  //treatment.insurance_amount = req.insurance_amount ? req.insurance_amount : 0;
  //treatment.patient_amount = req.patient_amount ? req.patient_amount : 0;
  treatment.note = req.note ? req.note : null;
  treatment.treatment_plan = req.treatment_plan ? req.treatment_plan : null;
  treatment.appointment = req.appointment ? req.appointment : null;
  treatment.status = req.status ? req.status : "PLAN";
  treatment.ada_code = req.ada_code ? req.ada_code : Procedure.procedure_code;
  treatment.fee = req.fee ? req.fee : Procedure.procedure_fee;
  //treatment.insurance_percent = req.insurance_percent
  //  ? req.insurance_percent
  //  : Procedure.insured_percent;
  treatment.description = req.description
    ? req.description
    : Procedure.description;
  treatment.mark_type = req.mark_type ? req.mark_type : Procedure.mark_type;
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
    }catch(errorRecall) {
      console.log(errorRecall);
    }
  }
  if (constants.TREATMENT.UPDATE_BALANCE_STATUS.includes(treatment.status)) {
    await Patient.updateBalance(
      treatment.patient,
      treatment.fee,
      constants.TRANSACTION.INCREASE
    );
  }
  return treatmentResult;
};
module.exports.updateTreatment = async function (treatment, req) {
  const Procedure = await ProcedureModel.findById(req.procedure_code);
  if (req.procedure_code && !Procedure) {
    return null;
  }
  treatment.treatment_date = req.treatment_date
    ? Date.parse(req.treatment_date)
    : treatment.treatment_date;
  treatment.patient =
    req.patient !== undefined ? req.patient : treatment.patient;
  treatment.assistant =
    req.assistant !== undefined ? req.assistant : treatment.assistant;
  treatment.provider =
    req.provider !== undefined ? req.provider : treatment.provider;
  treatment.procedure_code =
    req.procedure_code && Procedure
      ? req.procedure_code
      : treatment.procedure_code;
  treatment.tooth = req.tooth !== undefined ? req.tooth : treatment.tooth;
  treatment.surface =
    req.surface !== undefined ? req.surface : treatment.surface;
  //treatment.discount =
  //  req.discount !== undefined ? req.discount : treatment.discount;
  //treatment.insurance_amount =
  //  req.insurance_amount !== undefined
  //    ? req.insurance_amount
  //    : treatment.insurance_amount;
  //treatment.patient_amount =
  //  req.patient_amount !== undefined
  //    ? req.patient_amount
  //    : treatment.patient_amount;
  treatment.note = req.note !== undefined ? req.note : treatment.note;
  treatment.treatment_plan =
    req.treatment_plan !== undefined
      ? req.treatment_plan
      : treatment.treatment_plan;
  treatment.appointment =
    req.appointment !== undefined ? req.appointment : treatment.appointment;
  const isUpdateBalance =
    constants.TREATMENT.UPDATE_BALANCE_STATUS.includes(req.status) &&
    !constants.TREATMENT.UPDATE_BALANCE_STATUS.includes(treatment.status);
  treatment.status = req.status ? req.status : treatment.status;
  if (Procedure) {
    treatment.ada_code =
      req.ada_code != undefined ? req.ada_code : Procedure.procedure_code;
    treatment.fee = req.fee != undefined ? req.fee : Procedure.procedure_fee;
    //treatment.insurance_percent =
    //  req.insurance_percent != undefined
    //    ? req.insurance_percent
    //    : Procedure.insured_percent;
    treatment.description =
      req.description != undefined ? req.description : Procedure.description;
    treatment.mark_type =
      req.mark_type != undefined ? req.mark_type : Procedure.mark_type;
  }
  if (isUpdateBalance) {
    await Patient.updateBalance(
      treatment.patient._id,
      treatment.fee,
      constants.TRANSACTION.INCREASE
    );
  }
  return await treatment.save();
};