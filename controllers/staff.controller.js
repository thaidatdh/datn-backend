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
      payload: staffList,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Get staff list failed",
      exeption: err,
    });
  }
};
exports.index_provider = async function (req, res) {
  try {
    const options = {
      get_access_group: req.query.get_access_group,
      get_specialist: req.query.get_specialist,
    };
    const providerList = await StaffModel.get(
      { staff_type: constants.STAFF.STAFF_TYPE_PROVIDER },
      options
    );
    res.json({
      success: true,
      payload: providerList,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Get provider list failed",
      exeption: err,
    });
  }
};
exports.index_staff = async function (req, res) {
  try {
    const options = {
      get_access_group: req.query.get_access_group,
      get_specialist: req.query.get_specialist,
    };
    const staffList = await StaffModel.get(
      { staff_type: constants.STAFF.STAFF_TYPE_STAFF },
      options
    );
    res.json({
      success: true,
      payload: staffList,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Get staff list failed",
      exeption: err,
    });
  }
};
//insert
exports.add = async function (req, res) {
  try {
    const staffInfo = Object.assign({}, req.body);
    const rs = await StaffModel.insert(staffInfo);
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Insert staff failed",
      exeption: err,
    });
  }
};
exports.staff = async function (req, res) {
  try {
    const options = {
      get_access_group: req.query.get_access_group,
      get_specialist: req.query.get_specialist,
    };
    const staff = await StaffModel.get({ _id: req.params.staff_id }, options);
    if (staff && staff.length > 0) {
      res.json({
        success: true,
        payload: staff[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Find Staff failed",
      exeption: err,
    });
  }
};
exports.update = async function (req, res) {
  try {
    const staffInfo = req.body;
    const staffs = await StaffModel.get({ _id: req.params.staff_id }, {});
    if (staffs && staffs.length > 0) {
      const updatedStaff = await StaffModel.updateStaff(staffs[0], staffInfo);
      res.json({
        success: true,
        payload: updatedStaff,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Find Staff failed",
      exeption: err,
    });
  }
};
exports.delete = async function (req, res) {
  try {
    const staff = await StaffModel.findById(req.params.staff_id);
    if (staff) {
      await StaffModel.deleteOne({ _id: req.params.staff_id });
      await userModel.delete({ _id: staff.user });
      res.json({
        success: true,
        message: "Delete Successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Delete failed",
      exeption: err,
    });
  }
};
