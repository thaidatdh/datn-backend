const mongoose = require('mongoose');
const FrameTemplateModel = require("./image.frame.template.model");
const ImageMouthTemplateSchema = mongoose.Schema({
   name: String,
   thumbnail: String,
}, {
   timestamps: true,
   collection: 'image_mouth_template'
});
ImageMouthTemplateSchema.virtual("frames", {
  ref: "image_frame_template",
  localField: "_id",
  foreignField: "image_mouth_template_id",
  justOne: false,
});
const MouthTemplateModel = module.exports = mongoose.model(
  "image_mouth_template",
  ImageMouthTemplateSchema
);
module.exports.get = async function (query, populateOptions) {
  populateOptions = populateOptions || {};
  const promise = MouthTemplateModel.find(query);
  // Limit
  if (populateOptions.limit) {
    promise.limit(Number.parseInt(populateOptions.limit));
  }
  if (populateOptions.get_frames) {
    promise.populate("frames");
  }
  const resultQuery = await promise.exec();
  return resultQuery;
};
module.exports.insert = async function (req) {
  let mouth = new MouthTemplateModel();
  mouth.name = req.name ? req.name : null;
  mouth.thumbnail = req.thumbnail ? req.thumbnail : null;
  return await mouth.save();
};
module.exports.insertWithFrames = async function (req) {
  let mouth = new MouthTemplateModel();
  mouth.name = req.name ? req.name : null;
  mouth.thumbnail = req.thumbnail ? req.thumbnail : null;
  const insertedMouth = await mouth.save();
  let inseredFrameList = [];
  for (const frame of req.frames) {
    const insertedFrame = await FrameTemplateModel.insertWithMountId(
      insertedMouth._id,
      frame
    );
    inseredFrameList.push(insertedFrame);
  }
  insertedMouth.frames = inseredFrameList;
  return insertedMouth;
};
module.exports.updateMouth = async function (mouth, req) {
  mouth.name = req.name !== undefined ? req.name : mouth.name;
  mouth.thumbnail = req.thumbnail ? req.thumbnail : mouth.thumbnail;
  return await mouth.save();
};