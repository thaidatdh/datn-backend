//Import User Model
const mongoose = require("mongoose");
const MouthTemplateModel = require("../models/image.mouth.template.model");
const FrameTemplateModel = require("../models/image.frame.template.model");
const translator = require("../utils/translator");
//For index
exports.index = async function (req, res) {
  try {
    const options = {
      get_frames: req.query.get_frames,
      limit: req.query.limit,
    };
    const mouths = await MouthTemplateModel.get({}, options);
    const result = [];
    for (const mouth of mouths) {
      let mouthObject = Object.assign({}, mouth._doc);
      mouthObject.frames = [...mouth.frames];
      result.push(mouthObject);
    }
    res.json({
      success: true,
      payload: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Get mouth list failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    const rs = MouthTemplateModel.insertWithFrames(req.body);
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.Translate("Insert mouth failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.detail = async function (req, res) {
  try {
    const options = {
      get_frames: req.query.get_frames,
    };
    const mouth = await MouthTemplateModel.get({ _id: req.params.mouth_id }, options);
    if (mouth && mouth.length > 0) {
      res.json({
        success: true,
        payload: mouth[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.Translate("Image Mouth not found", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Get detail failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.update = async function (req, res) {
  try {
    const mouth = await MouthTemplateModel.findById(req.params.mouth_id);
    if (mouth) {
      const result = await MouthTemplateModel.updateMouth(mouth, req.body);
      res.json({
        success: true,
        payload: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.Translate("Image Mouth not found", req.query.lang),
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
    const mouth = MouthTemplateModel.findById(req.params.mouth_id);
    if (mouth) {
      await MouthTemplateModel.deleteOne({ _id: req.params.mouth_id });
      res.json({
        success: true,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.Translate("Image Mouth not found", req.query.lang),
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
exports.add_frame = async function (req, res) {
  try {
    const rs = FrameTemplateModel.insert(req.body);
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.Translate("Insert frame failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.detail_frame = async function (req, res) {
  try {
    const frame = await FrameTemplateModel.findById(req.params.frame_id);
    if (frame) {
      res.json({
        success: true,
        payload: frame,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.Translate("Image Frame not found", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Get detail failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.update_frame = async function (req, res) {
  try {
    const frame = await FrameTemplateModel.findById(req.params.frame_id);
    if (frame) {
      const result = await FrameTemplateModel.updateFrame(frame, req.body);
      res.json({
        success: true,
        payload: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.Translate("Image Frame not found", req.query.lang),
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
exports.delete_frame = async function (req, res) {
  try {
    const frame = FrameTemplateModel.findById(req.params.frame_id);
    if (frame) {
      await FrameTemplateModel.deleteOne({ _id: req.params.frame_id });
      res.json({
        success: true,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.Translate("Image Frame not found", req.query.lang),
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
