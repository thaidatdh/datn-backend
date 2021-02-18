//Import User Model
const mongoose = require("mongoose");
const imageModel = require("../models/images.model");
//For index
exports.index = async function (req, res) {
  try {
    const options = {
      limit: req.query.limit,
    };
    const images = await imageModel.get({}, options);
    res.json({
      success: true,
      images: images,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Get image list failed",
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
      images: images,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Get image list of patient " + patient_id + " failed",
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    const imageInfo = req.body;
    const rs = await imageModel.insert(imageInfo);
    return res.json({ success: true, image: rs });
  } catch (err) {
    return res.json({
      success: false,
      message: "Insert image failed",
      exeption: err,
    });
  }
};
