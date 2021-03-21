//Import User Model
const mongoose = require("mongoose");
const MouthModel = require("../models/image.mouth.model");
const FrameModel = require("../models/image.frame.model");
//For index
exports.index = async function (req, res) {
  try {
    const options = {
      get_frames: req.query.get_frames,
      limit: req.query.limit,
    };
    const mouths = await MouthModel.get({}, options);
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
      message: "Get mouth list failed",
      exeption: err,
    });
  }
};
exports.patient_mouth = async function (req, res) {
  const patient_id = req.params.patient_id;
  try {
    const options = {
      get_frames: req.query.get_frames,
      limit: req.query.limit,
    };

    const mouths = await MouthModel.get({ patient: patient_id }, options);
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
      message: "Get mouth list of patient " + patient_id + "failed",
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    if (req.body.patient == null) {
      return res.status(400).json({
        success: false,
        message: "Insert mouth failed. Require patient",
      });
    }
    const rs = MouthModel.insertWithFrames(req.body);
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Insert mouth failed",
      exeption: err,
    });
  }
};
exports.detail = async function (req, res) {
  try {
    const options = {
      get_frames: req.query.get_frames,
    };
    const mouth = await MouthModel.get({ _id: req.params.mouth_id }, options);
    if (mouth && mouth.length > 0) {
      const result = Object.assign({}, mouth[0]);
      result.frames = [...mouth[0].frames];
      res.json({
        success: true,
        payload: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Image Mouth not found",
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
    const mouth = await MouthModel.findById(req.params.mouth_id);
    if (mouth) {
      const result = await MouthModel.updateMouth(mouth, req.body);
      res.json({
        success: true,
        payload: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Image Mouth not found",
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
    const mouth = MouthModel.findById(req.params.mouth_id);
    if (mouth) {
      await MouthModel.deleteOne({ _id: req.params.mouth_id });
      res.json({
        success: true,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Image Mouth not found",
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
exports.add_frame = async function (req, res) {
  try {
    if (req.body.patient == null) {
      return res.status(400).json({
        success: false,
        message: "Insert frame failed. Require patient",
      });
    }
    const request = Object.assign(req.body, {
      image_mouth_id: req.params.mouth_id,
    });
    const rs = FrameModel.insert(request);
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Insert frame failed",
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
        message: "Image Frame not found",
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
exports.update_frame = async function (req, res) {
  try {
    const frame = await FrameModel.findById(req.params.frame_id);
    if (frame) {
      const result = await FrameModel.updateFrame(frame, req.body);
      res.json({
        success: true,
        payload: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Image Frame not found",
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
        message: "Image Frame not found",
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