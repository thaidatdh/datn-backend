//Import User Model
const mongoose = require("mongoose");
const constants = require("../constants/constants");
const holidayModel = require("../models/holiday.model");
const { options } = require("../routes");
const translator = require("../utils/translator");
//For index
exports.index = async function (req, res) {
  try {
    const options = {
      limit: req.query.limit,
      page: req.query.page,
    };
    const holidays = await holidayModel.get({}, options);
    let result = {
      success: true,
      payload: holidays,
    };
    if (options.page && options.limit) {
      const totalCount = await holidayModel.estimatedDocumentCount();
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
        "holiday list",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    const holiday = new holidayModel();
    holiday.description = req.body.description ? req.body.description : null;
    holiday.start_date = req.body.start_date ? req.body.start_date : null;
    holiday.end_date = req.body.end_date ? req.body.end_date : null;
    const rs = await holiday.save();
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.INSERT,
        "holiday",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
