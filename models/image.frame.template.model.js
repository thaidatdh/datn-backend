const mongoose = require("mongoose");
const constants = require("../constants/constants");

const ImageFrameTemplateSchema = mongoose.Schema(
  {
    image_mouth_template_id: mongoose.Types.ObjectId,
    order: Number,
    width_ratio: Number,
    height_ratio: Number,
    x_ratio: Number,
    y_ratio: Number,
  },
  {
    timestamps: true,
    collection: "image_frame_template",
  }
);
const FrameTemplateModel = (module.exports = mongoose.model(
  "image_frame_template",
  ImageFrameTemplateSchema
));

module.exports.get = async function (query, populateOptions) {
  populateOptions = populateOptions || {};
  const promise = FrameTemplateModel.find(query);
  // Limit
  if (populateOptions.limit) {
    promise.limit(Number.parseInt(populateOptions.limit));
  }
  const resultQuery = await promise.exec();
  return resultQuery;
};
module.exports.insert = async function (req) {
  let frame = new FrameTemplateModel();
  frame.image_mouth_template_id = req.image_mouth_template_id
    ? req.image_mouth_template_id
    : null;
  frame.order = req.order ? req.order : 0;
  frame.width_ratio = req.width_ratio ? req.width_ratio : 0;
  frame.height_ratio = req.height_ratio ? req.height_ratio : 0;
  frame.x_ratio = req.x_ratio ? req.x_ratio : 0;
  frame.y_ratio = req.y_ratio ? req.y_ratio : 0;
  return await frame.save();
};
module.exports.insertWithMountId = async function (image_mouth_id, req) {
  let frame = new FrameTemplateModel();
  frame.image_mouth_template_id = image_mouth_id ? image_mouth_id : null;
  frame.image = req.image ? req.image : null;
  frame.order = req.order ? req.order : 0;
  frame.width_ratio = req.width_ratio ? req.width_ratio : 0;
  frame.height_ratio = req.height_ratio ? req.height_ratio : 0;
  frame.x_ratio = req.x_ratio ? req.x_ratio : 0;
  frame.y_ratio = req.y_ratio ? req.y_ratio : 0;
  return await frame.save();
};
module.exports.updateFrame = async function (frame, req) {
  frame.image_mouth_template_id =
    req.image_mouth_template_id !== undefined
      ? req.image_mouth_template_id
      : frame.image_mouth_template_id;
  frame.order = req.order ? req.order : frame.order;
  frame.width_ratio = req.width_ratio ? req.width_ratio : frame.width_ratio;
  frame.height_ratio = req.height_ratio ? req.height_ratio : frame.height_ratio;
  frame.x_ratio = req.x_ratio ? req.x_ratio : frame.x_ratio;
  frame.y_ratio = req.y_ratio ? req.y_ratio : frame.y_ratio;
  return await frame.save();
};
