const mongoose = require("mongoose");
const constants = require("../constants/constants");
const Images = require("./images.model");
const ImageFrameSchema = mongoose.Schema(
  {
    image_mouth_id: mongoose.Types.ObjectId,
    image: {
      type: mongoose.Types.ObjectId,
      ref: "image",
    },
    order: Number,
    width_ratio: Number,
    height_ratio: Number,
    x_ratio: Number,
    y_ratio: Number,
  },
  {
    timestamps: true,
    collection: "image_frame",
  }
);
const FrameModel = (module.exports = mongoose.model(
  "image_frame",
  ImageFrameSchema
));

module.exports.get = async function (query, populateOptions) {
  populateOptions = populateOptions || {};
  const promise = FrameModel.find(query);
  promise.populate("image");
  // Limit
  if (populateOptions.limit) {
    promise.limit(Number.parseInt(populateOptions.limit));
  }
  const resultQuery = await promise.exec();
  return resultQuery;
};
module.exports.insert = async function (req) {
  let frame = new FrameModel();
  frame.image_mouth_id = req.image_mouth_id ? req.image_mouth_id : null;
  frame.image = req.image ? req.image : null;
  frame.order = req.order ? req.order : 0;
  frame.width_ratio = req.width_ratio ? req.width_ratio : 0;
  frame.height_ratio = req.height_ratio ? req.height_ratio : 0;
  frame.x_ratio = req.x_ratio ? req.x_ratio : 0;
  frame.y_ratio = req.y_ratio ? req.y_ratio : 0;
  return await frame.save();
};
module.exports.insertWithMountId = async function (image_mouth_id, req) {
  let frame = new FrameModel();
  frame.image_mouth_id = image_mouth_id ? image_mouth_id : null;
  frame.image = req.image ? req.image : null;
  frame.order = req.order ? req.order : 0;
  frame.width_ratio = req.width_ratio ? req.width_ratio : 0;
  frame.height_ratio = req.height_ratio ? req.height_ratio : 0;
  frame.x_ratio = req.x_ratio ? req.x_ratio : 0;
  frame.y_ratio = req.y_ratio ? req.y_ratio : 0;
  return await frame.save();
};
module.exports.updateFrame = async function (frame, req) {
  frame.image_mouth_id =
    req.image_mouth_id !== undefined
      ? req.image_mouth_id
      : frame.image_mouth_id;
  frame.image = req.image !== undefined ? req.image : frame.image;
  frame.order = req.order ? req.order : frame.order;
  frame.width_ratio = req.width_ratio ? req.width_ratio : frame.width_ratio;
  frame.height_ratio = req.height_ratio ? req.height_ratio : frame.height_ratio;
  frame.x_ratio = req.x_ratio ? req.x_ratio : frame.x_ratio;
  frame.y_ratio = req.y_ratio ? req.y_ratio : frame.y_ratio;
  return await frame.save();
};
