//Import User Model
const mongoose = require("mongoose");
const constants = require("../constants/constants");
const PrescriptionModel = require("../models/prescription.model");
const DetailModel = require("../models/prescription.detail.model");
const translator = require("../utils/translator");
//For index
exports.index = async function (req, res) {
  try {
    const options = {
      get_details: req.query.get_details,
      get_provider: req.query.get_provider,
      limit: req.query.limit,
    };
    const prescriptions = await PrescriptionModel.get({}, options);
    const result = [];
    for (const prescription of prescriptions) {
      let prescriptionObject = Object.assign({}, prescription._doc);
      prescriptionObject.detail = [...prescription.detail];
      result.push(prescriptionObject);
    }
    res.json({
      success: true,
      payload: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "prescription list",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.patient_prescription = async function (req, res) {
  const patient_id = req.params.patient_id;
  try {
    const options = {
      get_details: req.query.get_details,
      get_provider: req.query.get_provider,
      limit: req.query.limit,
    };

    const prescriptions = await PrescriptionModel.get(
      { patient: patient_id },
      options
    );
    const result = [];
    for (const prescription of prescriptions) {
      let prescriptionObject = Object.assign({}, prescription._doc);
      prescriptionObject.details = [...prescription.details];
      result.push(prescriptionObject);
    }
    res.json({
      success: true,
      payload: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "prescription list of patient " + patient_id + "failed",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    if (req.body.patient == null) {
      return res.status(400).json({
        success: false,
        message: await translator.Translate(
          "Insert prescription failed. Require patient",
          req.query.lang
        ),
      });
    }
    const rs = PrescriptionModel.insertWithDetails(req.body);
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.INSERT,
        "prescription",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.detail = async function (req, res) {
  try {
    const options = {
      get_details: req.query.get_details,
      get_provider: req.query.get_provider,
    };
    const prescription = await PrescriptionModel.get(
      { _id: req.params.prescription_id },
      options
    );
    if (prescription && prescription.length > 0) {
      const result = Object.assign({}, prescription[0]);
      result.details = [...prescription[0].details];
      res.json({
        success: true,
        payload: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage(
          "Prescription",
          req.query.lang
        ),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(constants.ACTION.GET, "detail ", req.query.lang),
      exeption: err,
    });
  }
};
exports.update = async function (req, res) {
  try {
    let prescription = await PrescriptionModel.findById(
      req.params.prescription_id
    );
    if (prescription) {
      const result = await PrescriptionModel.updatePrescription(
        prescription,
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
          "Prescription",
          req.query.lang
        ),
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
exports.delete = async function (req, res) {
  try {
    const prescription = PrescriptionModel.findById(req.params.prescription_id);
    if (prescription) {
      await PrescriptionModel.deleteOne({ _id: req.params.prescription_id });
      res.json({
        success: true,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage(
          "Prescription",
          req.query.lang
        ),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.DELETE,
        "Prescription",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.add_detail = async function (req, res) {
  try {
    const request = Object.assign(req.body, {
      image_prescription_id: req.params.prescription_id,
    });
    const rs = DetailModel.insert(request);
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.INSERT,
        "detail",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.detail_detail = async function (req, res) {
  try {
    const detail = await DetailModel.findById(req.params.detail_id);
    if (detail) {
      res.json({
        success: true,
        payload: detail,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage(
          "Prescription Detail",
          req.query.lang
        ),
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
exports.update_detail = async function (req, res) {
  try {
    let detail = await DetailModel.findById(req.params.detail_id);
    if (detail) {
      const result = await DetailModel.updateDetail(detail, req.body);
      res.json({
        success: true,
        payload: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage(
          "Prescription Detail",
          req.query.lang
        ),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.UPDATE,
        constants.ACTION.UPDATE,
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.delete_detail = async function (req, res) {
  try {
    const detail = DetailModel.findById(req.params.detail_id);
    if (detail) {
      await DetailModel.deleteOne({ _id: req.params.detail_id });
      res.json({
        success: true,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage(
          "Prescription Detail",
          req.query.lang
        ),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.DELETE,
        "Prescription Detail",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
