//Import User Model
const mongoose = require("mongoose");
const referralModel = require("../models/referral.model");
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
      referrals: referrals,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Get referral list failed",
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
      referrals: referrals,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Get referral list of patient " + patient_id + "failed",
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    if (req.body.patient == null) {
      return res.json({
        success: false,
        message: "Insert referral failed. Require patient",
      });
    }
    const rs = referralModel.insert(req.body);
    return res.json({ success: true, referral: rs });
  } catch (err) {
    return res.json({
      success: false,
      message: "Insert referral failed",
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
        referral: referral,
      });
    } else {
      res.json({
        success: false,
        message: "Referral not found",
      });
    }
  } catch (err) {
    res.json({
      success: false,
      message: "Update failed",
      exeption: err,
    });
  }
};
exports.update = async function (req, res) {
  try {
    const referral = await referralModel.findById(req.params.referral_id);
    if (referral) {
      const result = await referralModel.updateReferral(referral, req.body);
      res.json({
        success: true,
        referral: result,
      });
    } else {
      res.json({
        success: false,
        message: "Referral not found",
      });
    }
  } catch (err) {
    res.json({
      success: false,
      message: "Update failed",
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
      res.json({
        success: false,
        message: "Referral not found",
      });
    }
  } catch (err) {
    res.json({
      success: false,
      message: "Delete failed",
      exeption: err,
    });
  }
};
