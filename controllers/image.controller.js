//Import User Model
const mongoose = require("mongoose");
const constants = require("../constants/constants");
const imageModel = require("../models/images.model");
const translator = require("../utils/translator");
const firebaseStorage = require("../utils/storage");
//For index
exports.index = async function (req, res) {
  try {
    const options = {
      limit: req.query.limit,
      page: req.query.page,
    };
    const images = await imageModel.get({}, options);
    let result = {
      success: true,
      payload: images,
    };
    if (options.page && options.limit) {
      const totalCount = await imageModel.estimatedDocumentCount();
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
      page: req.query.page,
    };

    const images = await imageModel.get({ patient: patient_id }, options);
    let result = {
      success: true,
      payload: images,
    };
    if (options.page && options.limit) {
      const totalCount = await imageModel.countDocuments({
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
        "image list of patient " + patient_id,
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    if (req.body.data == null || req.body.file_name == null) {
      return res.json({
        success: false,
        message: await translator.FailedMessage(
          constants.ACTION.INSERT,
          "image failed. Require image data and file name",
          req.query.lang
        ),
      });
    }
    const filePath = firebaseStorage.getImageFilePath(
      req.body.patient,
      req.body.file_name
    );
    const url = await firebaseStorage.uploadBase64String(
      req.body.data,
      filePath
    );
    if (url == null) {
      return res.json({
        success: false,
        message: await translator.FailedMessage(
          constants.ACTION.INSERT,
          "image failed. Can not upload image",
          req.query.lang
        ),
      });
    }
    const imageInfo = Object.assign(req.body, { image_path: url });
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
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "detail ",
        req.query.lang
      ),
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
      const filePath = firebaseStorage.getImageFilePath(
        image.patient,
        image.image_path
      );
      await firebaseStorage.deleteFile(filePath);
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
