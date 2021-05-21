//Import User Model
const mongoose = require("mongoose");
const { TREATMENT } = require("../constants/constants");
const constants = require("../constants/constants");
const TreatmentModel = require("../models/treatment.model");
const translator = require("../utils/translator");
//For index
exports.index = async function (req, res) {
  try {
    const options = {
      get_patient: req.query.get_patient == "true",
      get_staff: req.query.get_staff == "true",
      get_plan: req.query.get_plan == "true",
      get_procedure: req.query.get_procedure == "true",
      limit: req.query.limit,
      page: req.query.page,
    };
    const treatments = await TreatmentModel.get({}, options);
    let result = {
      success: true,
      payload: treatments,
    };
    if (options.page && options.limit) {
      const totalCount = await TreatmentModel.estimatedDocumentCount();
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
        "Treatment list",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.patient_treatment = async function (req, res) {
  const patient_id = req.params.patient_id;
  try {
    const options = {
      get_patient: req.query.get_patient == "true",
      get_staff: req.query.get_staff == "true",
      get_plan: req.query.get_plan == "true",
      get_procedure: req.query.get_procedure == "true",
      limit: req.query.limit,
      page: req.query.page,
    };
    let query = { patient: patient_id };
    if (req.query.query_status) {
      query = Object.assign(query, { status: req.query.query_status });
    }
    if (req.query.from && req.query.to) {
      const startDate = new Date(req.query.from);
      const endDate = new Date(req.query.to);
      query = Object.assign(query, {
        treatment_date: { $gte: startDate, $lte: endDate },
      });
    } else if (
      req.query.from &&
      (req.query.to == undefined || req.query.to == "")
    ) {
      const startDate = new Date(req.query.from);
      query = Object.assign(query, {
        treatment_date: { $gte: startDate },
      });
    } else if (
      req.query.to &&
      (req.query.from == undefined || req.query.from == "")
    ) {
      const endDate = new Date(req.query.to);
      query = Object.assign(query, {
        treatment_date: { $lte: endDate },
      });
    }
    if (req.query.query_date) {
      const startDate = new Date(req.query.query_date);
      const endDate = new Date(
        new Date(req.query.query_date).setDate(startDate.getDate() + 1)
      );
      const DateRange = { $gte: startDate, $lt: endDate };
      query = Object.assign(query, {
        treatment_date: DateRange,
      });
    }
    if (req.query.link == "true") {
      query = Object.assign(query, {
        appointment: null,
      });
    }
    const treatments = await TreatmentModel.get(query, options);
    let result = {
      success: true,
      payload: treatments,
    };
    if (options.page && options.limit) {
      const totalCount = await TreatmentModel.countDocuments({
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
        "Treatment list of patient " + patient_id + "failed",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
/*exports.patient_treatment_plan = async function (req, res) {
  const patient_id = req.params.patient_id;
  try {
    const options = {
      get_patient: req.query.get_patient,
      get_staff: req.query.get_staff,
      get_plan: req.query.get_plan,
      limit: req.query.limit,
    };
    const query = {
      patient: req.params.patient_id,
      treatment_plan: req.params.plan_id,
    };
    const treatments = await TreatmentModel.get(query, options);
    res.json({
      success: true,
      payload: treatments,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(constants.ACTION.GET,"Treatment list of Plan of patient " + patient_id + "failed", req.query.lang),
      exeption: err,
    });
  }
};*/
exports.add = async function (req, res) {
  try {
    if (req.body.patient == null || req.body.procedure_code == null) {
      return res.status(400).json({
        success: false,
        message: await translator.FailedMessage(
          constants.ACTION.INSERT,
          "Treatment failed. Require patient and procedure",
          req.query.lang
        ),
      });
    }
    if (req.body.provider == null) {
      req.body.provider = req.default_provider_id;
    }
    const rs = await TreatmentModel.insert(req.body);
    if (rs) {
      return res.json({ success: true, payload: rs });
    } else {
      return res.status(400).json({
        success: false,
        message: await translator.FailedMessage(
          constants.ACTION.INSERT,
          "Treatment failed. Require procedure",
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
        "Treatment",
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
      get_plan: req.query.get_plan == "true",
      get_procedure: req.query.get_procedure == "true",
    };
    const treatments = await TreatmentModel.get(
      { _id: req.params.treatment_id },
      options
    );
    if (treatments && treatments.length > 0) {
      res.json({
        success: true,
        payload: treatments[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage("Treatment", req.query.lang),
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
    let treatment = await TreatmentModel.findById(req.params.treatment_id);
    if (treatment) {
      const result = await TreatmentModel.updateTreatment(treatment, req.body);
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
            "Treatment (Require valid procedure)",
            req.query.lang
          ),
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage("Treatment", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.UPDATE,
        "Treatment",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.delete = async function (req, res) {
  try {
    const treatment = TreatmentModel.findById(req.params.treatment_id);
    if (treatment) {
      if (TREATMENT.UPDATE_BALANCE_STATUS.includes(treatment.status)) {
        return res.status(400).json({
          success: false,
          message: await translator.Translate(
            "Can not delete Completed/Existing Treatment",
            req.query.lang
          ),
        });
      } else {
        await TreatmentModel.deleteOne({ _id: req.params.treatment_id });
        res.json({
          success: true,
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage("Treatment", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.DELETE,
        "Treatment",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
