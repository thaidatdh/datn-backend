//Import User Model
const mongoose = require("mongoose");
const imageModel = require("../models/images.model");
const translator = require("../utils/translator");
//For index
exports.index = async function (req, res) {
  try {
    const options = {
      limit: req.query.limit,
    };
    const images = await imageModel.get({}, options);
    res.json({
      success: true,
      payload: images,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Get image list failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.image_of_patient = async function (req, res) {
  const patient_id = req.params.patient_id;
  try {
    const options = {
      limit: req.query.limit,
    };

    const images = await imageModel.get({ patient: patient_id }, options);
    res.json({
      success: true,
      payload: images,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Get image list of patient " + patient_id + " failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    const imageInfo = req.body;
    const rs = await imageModel.insert(imageInfo);
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.Translate("Insert image failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.detail = async function (req, res) {
  try {
    const image = await imageModel.findById(req.params.image_id);
    if (image) {
      res.json({
        success: true,
        payload: image,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.Translate("Image not found", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Get detail  failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.update = async function (req, res) {
  try {
    const image = await imageModel.findById(req.params.image_id);
    if (image) {
      const result = await imageModel.updateImage(image, req.body);
      res.json({
        success: true,
        payload: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.Translate("Image not found", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message:  await translator.Translate("Update failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.delete = async function (req, res) {
  try {
    const image = imageModel.findById(req.params.image_id);
    if (image) {
      await imageModel.deleteOne({ _id: req.params.image_id });
      res.json({
        success: true,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.Translate("Image not found", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Delete failed", req.query.lang),
      exeption: err,
    });
  }
};
