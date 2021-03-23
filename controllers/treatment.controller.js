//Import User Model
const mongoose = require("mongoose");
const TreatmentModel = require("../models/treatment.model");
//For index
exports.index = async function (req, res) {
  try {
    const options = {
      get_patient: req.query.get_patient,
      get_staff: req.query.get_staff,
      get_plan: req.query.get_plan,
      limit: req.query.limit,
    };
    const treatments = await TreatmentModel.get({}, options);
    res.json({
      success: true,
      payload: treatments,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Get Treatment list failed",
      exeption: err,
    });
  }
};
exports.patient_treatment = async function (req, res) {
  const patient_id = req.params.patient_id;
  try {
    const options = {
      get_patient: req.query.get_patient,
      get_staff: req.query.get_staff,
      get_plan: req.query.get_plan,
      limit: req.query.limit,
    };

    const treatments = await TreatmentModel.get(
      { patient: patient_id },
      options
    );
    res.json({
      success: true,
      payload: treatments,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Get Treatment list of patient " + patient_id + "failed",
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
      message: "Get Treatment list of Plan of patient " + patient_id + "failed",
      exeption: err,
    });
  }
};*/
exports.add = async function (req, res) {
  try {
    if (req.body.patient == null || req.body.procedure_code == null) {
      return res.status(400).json({
        success: false,
        message: "Insert Treatment failed. Require patient and procedure",
      });
    }
    const rs = TreatmentModel.insert(req.body);
    if (rs) {
      return res.json({ success: true, payload: rs });
    } else {
      return res.status(400).json({
        success: false,
        message: "Insert Treatment failed. Require procedure",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Insert Treatment failed",
      exeption: err,
    });
  }
};
exports.detail = async function (req, res) {
  try {
    const options = {
      get_patient: req.query.get_patient,
      get_staff: req.query.get_staff,
      get_plan: req.query.get_plan,
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
        message: "Treatment not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Update failed",
      exeption: err,
    });
  }
};
exports.update = async function (req, res) {
  try {
    const treatment = await TreatmentModel.findById(req.params.treatment_id);
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
          message: "Insert Treatment failed. Require valid procedure",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "Treatment not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Update failed",
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
        message: "Treatment not found",
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
