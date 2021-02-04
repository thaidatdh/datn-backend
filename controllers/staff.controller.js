//Import User Model
const mongoose = require("mongoose");
const constants = require("../constants/constants");
const StaffModel = require("../models/staff.model");
//For index
exports.index = async function (req, res) {
  try {
    const staffList = await StaffModel.get(
      {},
      { get_access_group: true, get_specialist: true }
    );
    res.json({
      success: true,
      staffs: staffList,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Get staff list failed",
      exeption: err,
    });
  }
};
exports.index_provider = async function (req, res) {
  try {
    const options = req.body.options ? req.body.options : {};
    const providerList = await StaffModel.get({staff_type: constants.STAFF.STAFF_TYPE_PROVIDER}, options);
    res.json({
      success: true,
      providers: providerList,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Get provider list failed",
      exeption: err,
    });
  }
};
exports.index_staff = async function (req, res) {
  try {
    const options = req.body.options ? req.body.options : {};
    const staffList = await StaffModel.get(
      { staff_type: constants.STAFF.STAFF_TYPE_STAFF },
      options
    );
    res.json({
      success: true,
      staffs: staffList,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Get staff list failed",
      exeption: err,
    });
  }
};
//insert
exports.add = async function (req, res) {
  try {
    const rs = await StaffModel.insert(req.body.staff);
    return res.json({ success: true, staff: rs });
  } catch (err) {
    return res.json({
      success: false,
      message: "Insert staff failed",
      exeption: err,
    });
  }
};
