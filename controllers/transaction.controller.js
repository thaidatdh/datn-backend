//Import User Model
const mongoose = require("mongoose");
const constants = require("../constants/constants");
const TransactionModel = require("../models/transaction.model");
const translator = require("../utils/translator");
//For index
exports.index = async function (req, res) {
  try {
    const options = {
      get_patient: req.query.get_patient == "true",
      get_staff: req.query.get_staff == "true",
      get_treatment: req.query.get_treatment == "true",
      limit: req.query.limit,
      page: req.query.page,
    };
    const transactions = await TransactionModel.get({}, options);
    let result = {
      success: true,
      payload: transactions,
    };
    if (options.page && options.limit) {
      const totalCount = await TransactionModel.estimatedDocumentCount();
      const limit = Number.parseInt(options.limit);
      const page = Number.parseInt(options.page);
      result = Object.assign(result, {
        total: totalCount,
        page: page,
        limit: limit,
        total_page: Math.ceil(totalCount / limit),
      });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "Transaction list",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.patient_transaction = async function (req, res) {
  const patient_id = req.params.patient_id;
  try {
    const options = {
      get_patient: req.query.get_patient == "true",
      get_staff: req.query.get_staff == "true",
      get_treatment: req.query.get_treatment == "true",
      limit: req.query.limit,
      page: req.query.page,
    };

    const transactions = await TransactionModel.get(
      { patient: patient_id },
      options
    );
    let result = {
      success: true,
      payload: transactions,
    };
    if (options.page && options.limit) {
      const totalCount = await TransactionModel.countDocuments({
        patient: patient_id,
      });
      const limit = Number.parseInt(options.limit);
      const page = Number.parseInt(options.page);
      result = Object.assign(result, {
        total: totalCount,
        page: page,
        limit: limit,
        total_page: Math.ceil(totalCount / limit),
      });
    }
    res.json(result);
  } catch (err) {
    
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "Transaction list of patient " + patient_id + "failed",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    if (req.body.patient == null) {
      return res.status(400).json({
        success: false,
        message: await translator.FailedMessage(
          constants.ACTION.INSERT,
          "Transaction failed. Require patient",
          req.query.lang
        ),
      });
    }
    if (req.body.provider == null) {
      req.body.provider = req.default_provider_id;
    }
    const rs = await TransactionModel.insert(req.body);
    if (rs != null) {
      return res.json({ success: true, payload: rs });
    } else {
      return res.status(400).json({
        success: false,
        message: await translator.FailedMessage(
          constants.ACTION.INSERT,
          "Transaction failed",
          req.query.lang
        ),
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.INSERT,
        "Transaction",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.detail = async function (req, res) {
  try {
    const options = {
      get_patient: req.query.get_patient == "true",
      get_staff: req.query.get_staff == "true",
      get_treatment: req.query.get_treatment == "true",
    };
    const transactions = await TransactionModel.get(
      { _id: req.params.transaction_id },
      options
    );
    if (transactions && transactions.length > 0) {
      res.json({
        success: true,
        payload: transactions[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage("Transaction", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "detail",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.update = async function (req, res) {
  try {
    let transaction = await TransactionModel.findById(req.params.transaction_id);
    if (transaction) {
      const result = await TransactionModel.updateTransaction(transaction, req.body);
      if (result) {
        res.json({
          success: true,
          payload: result,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: await translator.FailedMessage(
            constants.ACTION.INSERT,
            "Transaction",
            req.query.lang
          ),
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage("Transaction", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.UPDATE,
        "Transaction",
        req.query.lang
      ),
      exeption: err,
    });
  }
};