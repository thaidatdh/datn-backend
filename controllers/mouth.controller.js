//Import User Model
const mongoose = require("mongoose");
const constants = require("../constants/constants");
const MouthModel = require("../models/image.mouth.model");
const FrameModel = require("../models/image.frame.model");
const translator = require("../utils/translator");
//For index
exports.index = async function (req, res) {
  try {
    const options = {
      get_frames: req.query.get_frames == "true",
      limit: req.query.limit,
    };
    const mouths = await MouthModel.get({}, options);
    res.json({
      success: true,
      payload: mouths,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "mouth list",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.patient_mouth = async function (req, res) {
  const patient_id = req.params.patient_id;
  try {
    const options = {
      get_frames: req.query.get_frames == "true",
      limit: req.query.limit,
    };
    let query = { patient: patient_id };
    if (req.query.template !== undefined || req.query.template === "others") {
      query = Object.assign(query, {
        template: req.query.template === "others" ? null : req.query.template,
      });
    }
    const mouths = await MouthModel.get(query, options);
    res.json({
      success: true,
      payload: mouths,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "mouth list of patient " + patient_id,
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
        message: await translator.FailedMessage(
          constants.ACTION.INSERT,
          "mouth failed. Require patient",
          req.query.lang
        ),
      });
    }
    const rs = await MouthModel.insertWithFrames(req.body);
    const insertedResult = await MouthModel.get(
      { _id: rs._id },
      { get_frames: true }
    );
    if (insertedResult && insertedResult.length > 0) {
      return res.json({
        success: true,
        payload: insertedResult[0],
      });
    }
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.INSERT,
        "mouth",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.detail = async function (req, res) {
  try {
    const options = {
      get_frames: req.query.get_frames == "true",
    };
    const mouth = await MouthModel.get({ _id: req.params.mouth_id }, options);
    if (mouth && mouth.length > 0) {
      res.json({
        success: true,
        payload: mouth[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage(
          "Image Mouth",
          req.query.lang
        ),
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
    let mouth = await MouthModel.findById(req.params.mouth_id);
    if (mouth) {
      const result = await MouthModel.updateMouth(mouth, req.body);
      const updatedResult = await MouthModel.get(
        { _id: req.params.mouth_id },
        { get_frames: true }
      );
      if (updatedResult && updatedResult.length > 0) {
        return res.json({
          success: true,
          payload: updatedResult[0],
        });
      }
      return res.json({
        success: true,
        payload: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage(
          "Image Mouth",
          req.query.lang
        ),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.UPDATE,
        "detail",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.delete = async function (req, res) {
  try {
    const mouth = MouthModel.findById(req.params.mouth_id);
    if (mouth) {
      await MouthModel.deleteOne({ _id: req.params.mouth_id });
      await FrameModel.deleteMany({ image_mouth_id: req.params.mouth_id });
      res.json({
        success: true,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage(
          "Image Mouth",
          req.query.lang
        ),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.DELETE,
        "Image Mounth",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.add_frame = async function (req, res) {
  try {
    const request = Object.assign(req.body, {
      image_mouth_id: req.params.mouth_id,
    });
    const rs = await FrameModel.insert(request);
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.INSERT,
        "frame",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.detail_frame = async function (req, res) {
  try {
    const frame = await FrameModel.findById(req.params.frame_id);
    if (frame) {
      res.json({
        success: true,
        payload: frame,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage(
          "Image Frame",
          req.query.lang
        ),
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
exports.update_frame = async function (req, res) {
  try {
    let frame = await FrameModel.findById(req.params.frame_id);
    if (frame) {
      const result = await FrameModel.updateFrame(frame, req.body);
      res.json({
        success: true,
        payload: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage(
          "Image Frame",
          req.query.lang
        ),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.UPDATE,
        "Image Frame",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.delete_frame = async function (req, res) {
  try {
    const frame = FrameModel.findById(req.params.frame_id);
    if (frame) {
      await FrameModel.deleteOne({ _id: req.params.frame_id });
      res.json({
        success: true,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage(
          "Image Frame",
          req.query.lang
        ),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.DELETE,
        "Image Frame",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
