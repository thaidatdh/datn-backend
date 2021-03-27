//Import User Model
const mongoose = require("mongoose");
const referralModel = require("../models/referral.model");
const translator = require("../utils/translator");
//For index
exports.index = async function (req, res) {
  try {
    const options = {
      get_patient: req.query.get_patient,
      get_staff: req.query.get_staff,
      get_source: req.query.get_source,
      limit: req.query.limit,
    };
    const referrals = await referralModel.get({}, options);
    res.json({
      success: true,
      payload: referrals,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Get referral list failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.patient_referral = async function (req, res) {
  const patient_id = req.params.patient_id;
  try {
    const options = {
      get_patient: req.query.get_patient,
      get_staff: req.query.get_staff,
      get_source: req.query.get_source,
      limit: req.query.limit,
    };

    const referrals = await referralModel.get({ patient: patient_id }, options);
    res.json({
      success: true,
      payload: referrals,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Get referral list of patient " + patient_id + "failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    if (req.body.patient == null) {
      return res.status(400).json({
        success: false,
        message: await translator.Translate("Insert referral failed. Require patient", req.query.lang),
      });
    }
    const rs = referralModel.insert(req.body);
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.Translate("Insert referral failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.detail = async function (req, res) {
  try {
    const referral = await referralModel.findById(req.params.referral_id);
    if (referral) {
      res.json({
        success: true,
        payload: referral,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.Translate("Referral not found", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Get detail failed", req.query.lang),
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
        message: await translator.Translate("Referral not found", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message:  await translator.Translate("Update failed", req.query.lang),
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
        message: await translator.Translate("Referral not found", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Delete failed", req.query.lang),
      exeption: err,
    });
  }
};
