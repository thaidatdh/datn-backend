//Import User Model
const mongoose = require("mongoose");
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
      limit: req.query.limit,
      page: req.query.page,
    };

    const treatments = await TreatmentModel.get(
      { patient: patient_id },
      options
    );
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
    const rs = TreatmentModel.insert(req.body);
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
      message: await translator.FailedMessage(constants.ACTION.GET, "detail", req.query.lang),
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
      await TreatmentModel.deleteOne({ _id: req.params.treatment_id });
      res.json({
        success: true,
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
        constants.ACTION.DELETE,
        "Treatment",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
