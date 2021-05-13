//Import User Model
const mongoose = require("mongoose");
const constants = require("../constants/constants");
const referralModel = require("../models/referral.model");
const translator = require("../utils/translator");
//For index
exports.index = async function (req, res) {
  try {
    const options = {
      get_patient: req.query.get_patient == "true",
      get_staff: req.query.get_staff == "true",
      get_source: req.query.get_source == "true",
      limit: req.query.limit,
      page: req.query.page,
    };
    const referrals = await referralModel.get({}, options);
    res.json({
      success: true,
      payload: referrals,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "referral list",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.patient_referral = async function (req, res) {
  const patient_id = req.params.patient_id;
  try {
    const options = {
      get_patient: req.query.get_patient == "true",
      get_staff: req.query.get_staff == "true",
      get_source: req.query.get_source == "true",
      limit: req.query.limit,
      page: req.query.page,
    };

    const referrals = await referralModel.get({ patient: patient_id }, options);
    let result = {
      success: true,
      payload: referrals,
    };
    if (options.page && options.limit) {
      const totalCount = await referralModel.countDocuments({
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
        "referral list of patient " + patient_id + "failed",
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
          "referral failed. Require patient",
          req.query.lang
        ),
      });
    }
    const rs = await referralModel.insert(req.body);
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.INSERT,
        "referral",
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
      get_source: req.query.get_source == "true",
      limit: req.query.limit,
      page: req.query.page,
      one: true,
    };
    const referral = await referralModel.get({ _id: req.params.referral_id }, options);
    if (referral) {
      res.json({
        success: true,
        payload: referral,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage("Referral", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(constants.ACTION.GET, "detail", req.query.lang),
      exeption: err,
    });
  }
};
exports.update = async function (req, res) {
  try {
    let referral = await referralModel.findById(req.params.referral_id);
    if (referral) {
      const result = await referralModel.updateReferral(referral, req.body);
      res.json({
        success: true,
        payload: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage("Referral", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.UPDATE,
        "Referral",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.delete = async function (req, res) {
  try {
    const referral = referralModel.findById(req.params.referral_id);
    if (referral) {
      await referralModel.deleteOne({ _id: req.params.referral_id });
      res.json({
        success: true,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage("Referral", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.DELETE,
        "Referral",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
