//Import User Model
const mongoose = require("mongoose");
const constants = require("../constants/constants");
const ProviderScheduleModel = require("../models/provider.schedule.model");
const StaffModel = require("../models/staff.model");
const translator = require("../utils/translator");
//For index
exports.index = async function (req, res) {
  try {
    const options = {
      get_provider: req.query.get_provider == "true",
      limit: req.query.limit,
      page: req.query.page,
    };
    let query = {};
    if (req.body.date) {
      const CurrentDate = new Date(req.body.date);
      query = Object.assign(query, { end_date: { $gte: CurrentDate } });
    }
    const schedules = await ProviderScheduleModel.get(query, options);
    let result = {
      success: true,
      payload: schedules,
    };
    if (options.page && options.limit) {
      const totalCount = await ProviderScheduleModel.countDocuments(query);
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
        "Provider schedule list",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.schedule_of_provider = async function (req, res) {
  try {
    const options = {
      get_provider: req.query.get_provider == "true",
      limit: req.query.limit,
      page: req.query.page,
    };
    const schedules = await ProviderScheduleModel.get(
      { provider: req.params.provider_id },
      options
    );
    let result = {
      success: true,
      payload: schedules,
    };
    if (options.page && options.limit) {
      const totalCount = await ProviderScheduleModel.countDocuments({
        provider: req.params.provider_id,
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
        "Provider schedule of provider",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.providers_has_schedule = async function (req, res) {
  try {
    const dateValue = new Date(req.params.date);
    const ListSchedule = await ProviderScheduleModel.find({
      $or: [
        {
          start_date: { $lte: dateValue },
        },
        {
          end_date: { $gte: dateValue },
        },
      ],
    });
    let ListProviderId = [];
    for (const schedule of ListSchedule) {
      if (ProviderScheduleModel.isAvailable(schedule, dateValue)) {
        ListProviderId.push(schedule.provider);
      }
    }
    const providers = await StaffModel.get(
      { _id: { $in: ListProviderId } },
      {}
    );
    let result = {
      success: true,
      payload: providers,
    };
    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "Provider list",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.check_if_provider_working = async function (req, res) {
  try {
    const result = await ProviderScheduleModel.isProviderAvailable(
      req.params.provider_id,
      req.params.date
    );
    res.json({
      success: true,
      payload: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "Provider list",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    if (req.body.provider == null) {
      return res.status(403).json({
        success: false,
        message: await translator.Translate("Require provider", req.query.lang),
      });
    }
    if (req.body.start_date == null) {
      return res.status(403).json({
        success: false,
        message: await translator.Translate(
          "Require start date",
          req.query.lang
        ),
      });
    }
    if (req.body.end_date == null) {
      return res.status(403).json({
        success: false,
        message: await translator.Translate("Require end date", req.query.lang),
      });
    }
    const startDate = new Date(req.body.start_date);
    const endDate = new Date(req.body.end_date);
    if (endDate < startDate) {
      return res.status(403).json({
        success: false,
        message: await translator.Translate(
          "Require start date to be before end date",
          req.query.lang
        ),
      });
    }
    if (req.body.value == null) {
      return res.status(403).json({
        success: false,
        message: await translator.Translate("Require value", req.query.lang),
      });
    }
    const rs = await ProviderScheduleModel.insert(req.body);
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.INSERT,
        "Provider schedule",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.detail = async function (req, res) {
  try {
    const options = {
      get_provider: req.query.get_provider == "true",
      one: true,
    };
    const schedule = await ProviderScheduleModel.get(
      { _id: req.params.schedule_id },
      options
    );
    if (schedule) {
      res.json({
        success: true,
        payload: schedule,
      });
    } else {
      res.status(500).json({
        success: false,
        message: await translator.NotFoundMessage(
          "Provider schedule",
          req.query.lang
        ),
      });
    }
  } catch (err) {
    res.json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "Provider Schedule",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.update = async function (req, res) {
  try {
    let schedule = await ProviderScheduleModel.findById(req.params.schedule_id);
    if (schedule) {
      const result = await ProviderScheduleModel.updateSchedule(
        schedule,
        req.body
      );
      res.json({
        success: true,
        payload: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage(
          "Provider schedule",
          req.query.lang
        ),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.UPDATE,
        "Provider schedule",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.delete = async function (req, res) {
  try {
    const schedule = await ProviderScheduleModel.findById(
      req.params.schedule_id
    );
    if (schedule) {
      await ProviderScheduleModel.deleteOne({ _id: req.params.schedule_id });
      res.json({
        success: true,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage(
          "Provider schedule",
          req.query.lang
        ),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.DELETE,
        "Provider Schedule",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
