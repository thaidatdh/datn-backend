//Import User Model
const mongoose = require("mongoose");
const constants = require("../constants/constants");
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
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "image list",
        req.query.lang
      ),
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
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "image list of patient " + patient_id,
        req.query.lang
      ),
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
      message: await translator.FailedMessage(
        constants.ACTION.INSERT,
        "image",
        req.query.lang
      ),
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
        message: await translator.NotFoundMessage("Image", req.query.lang),
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
    let image = await imageModel.findById(req.params.image_id);
    if (image) {
      const result = await imageModel.updateImage(image, req.body);
      res.json({
        success: true,
        payload: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage("Image", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.UPDATE,
        "Image",
        req.query.lang
      ),
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
        message: await translator.NotFoundMessage("Image", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.DELETE,
        "Image",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
