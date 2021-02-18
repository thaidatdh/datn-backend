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
    let document = new referralModel();
    document.referral_date = req.body.referral_date
      ? Date.parse(req.body.referral_date)
      : Date.now();
    document.patient = req.body.patient ? req.body.patient : null;
    document.ref_patient = req.body.ref_patient ? req.body.ref_patient : null;
    document.referral_source = req.body.referral_source
      ? req.body.referral_source
      : null;
    document.ref_staff = req.body.ref_staff ? req.body.ref_staff : null;
    document.referral_type = req.body.referral_type
      ? req.body.referral_type
      : "TO";
    
    if (document.patient == null) {
      return res.json({
        success: false,
        message: "Insert referrao failed. Require patient",
      });
    }
    const rs = await document.save();
    return res.json({ success: true, document: rs });
  } catch (err) {
    return res.json({
      success: false,
      message: "Insert document failed",
      exeption: err,
    });
  }
};
