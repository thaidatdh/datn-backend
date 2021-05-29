const mongoose = require("mongoose");
const constants = require("../constants/constants");
const PatientModel = require("./patient.model");
const Staff = require("./staff.model");
const TreatmentModel = require("./treatment.model");
const TransactionSchema = mongoose.Schema(
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
    treatments: [String],
    amount: mongoose.Types.Decimal128,
    paid_amount: mongoose.Types.Decimal128,
    return_amount: mongoose.Types.Decimal128,
    transaction_date: Date,
    transaction_type: String,
    is_delete: {
      type: Boolean,
      default: false,
    },
    note: String,
  },
  {
    timestamps: true,
    collection: "transactions",
  }
);
TransactionSchema.set("toJSON", { virtuals: true });
TransactionSchema.set("toObject", { virtuals: true });
TransactionSchema.virtual("treatment_list", {
  ref: "treatment",
  localField: "_id",
  foreignField: "transaction",
  justOne: false,
});
const TransactionModel = (module.exports = mongoose.model(
  "transaction",
  TransactionSchema
));
module.exports.get = async function (query, populateOptions) {
  populateOptions = populateOptions || {};
  const promise =
    populateOptions.one == true
      ? TransactionModel.findOne(query)
      : TransactionModel.find(query).sort({
          transaction_date: -1,
          is_delete: 1,
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
  if (populateOptions.get_treatment) {
    promise.populate("treatment_list");
  }
  const resultQuery = await promise.exec();
  return resultQuery;
};
/**
 * NOTE:
 * credit is amount practice need to pay patient back
 * amount of balance increase by complete treatment fee
 * PAYMENT, DISCOUNT(ADJUSTMENT): patient pay, decrease balance
 * ADJUSTMENT: increase balance
 * CREDIT(ADJUSTMENT): no affect to balance, increase credit
 * TRANSFER CREDIT: increase balance, tranfer the amount to credit (ex: balance = -100, credit = 10 -> transfer 20 -> balance = -80, credit = 30)
 * REFUND(full/partial): practice pay patient back, decrease credit
 * */
module.exports.insert = async function (req) {
  let transaction = new TransactionModel();
  transaction.transaction_date = req.transaction_date
    ? new Date(Date.parse(req.transaction_date))
    : new Date(Date.now());
  transaction.patient = req.patient ? req.patient : null;
  transaction.provider = req.provider ? req.provider : null;
  transaction.treatments = req.treatments ? req.treatments : null;
  transaction.note = req.note ? req.note : null;
  transaction.amount = req.amount ? req.amount : 0;
  transaction.paid_amount = req.paid_amount ? req.paid_amount : 0;
  transaction.return_amount =
    parseFloat(transaction.paid_amount) - parseFloat(transaction.amount);
  transaction.transaction_type = req.transaction_type
    ? req.transaction_type
    : constants.TRANSACTION.TRANSACTION_TYPE_PAYMENT;
  transaction.is_delete = req.is_delete ? req.is_delete : false;
  const transactionResult = await transaction.save();
  if (transaction.is_delete == true) return transactionResult;
  if (Array.isArray(transaction.treatments)) {
    await TreatmentModel.updateMany(
      { _id: { $in: transaction.treatments } },
      { transaction: transactionResult._id }
    );
  }
  await PatientModel.updatePaidAmount(
    transaction.patient,
    req.amount,
    constants.TRANSACTION.INCREASE
  );
  return transactionResult;
};
module.exports.updateTransaction = async function (transaction, req) {
  transaction.note = req.note !== undefined ? req.note : transaction.note;
  const isDelete = transaction.is_delete == false && req.is_delete == true;
  transaction.is_delete =
    req.is_delete !== undefined ? req.is_delete : transaction.is_delete;
  const transactionResult = await transaction.save();
  if (isDelete == false) return transactionResult;
  await TreatmentModel.updateMany(
    { transaction: mongoose.Types.ObjectId(transaction._id) },
    { transaction: null }
  );
  await PatientModel.updatePaidAmount(
    transaction.patient,
    req.amount,
    constants.TRANSACTION.DECREASE
  );
  return transactionResult;
};
