//Import User Model
const mongoose = require("mongoose");
const constants = require("../constants/constants");
const StaffModel = require("../models/staff.model");
const translator = require("../utils/translator");
//For index
exports.index = async function (req, res) {
  try {
    const options = {
      get_access_group: req.query.get_access_group == "true",
      get_specialty: req.query.get_specialty == "true",
      limit: req.query.limit,
      page: req.query.page,
    };
    const staffList = await StaffModel.get({}, options);
    let result = {
      success: true,
      payload: staffList,
    };
    if (options.page && options.limit) {
      const totalCount = await StaffModel.estimatedDocumentCount();
      const limit = Number.parseInt(options.limit);
      const page = Number.parseInt(options.page);
      result = Object.assign(result, {
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
        "staff list",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.index_provider = async function (req, res) {
  try {
    const options = {
      get_access_group: req.query.get_access_group == "true",
      get_specialty: req.query.get_specialty == "true",
      limit: req.query.limit,
      page: req.query.page,
    };
    const providerList = await StaffModel.get(
      { staff_type: constants.STAFF.STAFF_TYPE_PROVIDER },
      options
    );
    let result = {
      success: true,
      payload: providerList,
    };
    if (options.page && options.limit) {
      const totalCount = await StaffModel.countDocuments({
        staff_type: constants.STAFF.STAFF_TYPE_PROVIDER,
      });
      const limit = Number.parseInt(options.limit);
      const page = Number.parseInt(options.page);
      result = Object.assign(result, {
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
        "provider list",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.index_staff = async function (req, res) {
  try {
    const options = {
      get_access_group: req.query.get_access_group == "true",
      get_specialty: req.query.get_specialty == "true",
      limit: req.query.limit,
      page: req.query.page,
    };
    const staffList = await StaffModel.get(
      { staff_type: constants.STAFF.STAFF_TYPE_STAFF },
      options
    );
    let result = {
      success: true,
      payload: staffList,
    };
    if (options.page && options.limit) {
      const totalCount = await StaffModel.countDocuments({
        staff_type: constants.STAFF.STAFF_TYPE_STAFF,
      });
      const limit = Number.parseInt(options.limit);
      const page = Number.parseInt(options.page);
      result = Object.assign(result, {
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
        "staff list",
        req.query.lang
      ),
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
      message: await translator.FailedMessage(
        constants.ACTION.INSERT,
        "staff",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.staff = async function (req, res) {
  try {
    const options = {
      get_access_group: req.query.get_access_group == "true",
      get_specialty: req.query.get_specialty == "true",
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
        message: await translator.NotFoundMessage("Staff", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(constants.ACTION.GET, "Staff", req.query.lang),
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
        message: await translator.NotFoundMessage("Staff", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(constants.ACTION.GET, "Staff", req.query.lang),
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
        message: await translator.DeleteMessage(req.query.lang),
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage("Staff", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.DELETE,
        "Staff",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
