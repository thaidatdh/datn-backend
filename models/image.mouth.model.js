const mongoose = require("mongoose");
const Patient = require("./patient.model");
const Staff = require("./staff.model");
const FrameModel = require("./image.frame.model");
const ImageMouthSchema = mongoose.Schema(
  {
    name: String,
    note: String,
    entry_date: Date,
    thumbnail: String,
    created_by: {
      type: mongoose.Types.ObjectId,
      ref: "staff",
      required: true,
    },
    patient: {
      type: mongoose.Types.ObjectId,
      ref: "patient",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "image_mouth",
  }
);
ImageMouthSchema.virtual("frames", {
  ref: "image_frame",
  localField: "_id",
  foreignField: "image_mouth_id",
  justOne: false,
});
const MouthModel = (module.exports = mongoose.model(
  "image_mouth",
  ImageMouthSchema
));

module.exports.get = async function (query, populateOptions) {
  populateOptions = populateOptions || {};
  const promise = MouthModel.find(query);
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
  let mouth = new MouthModel();
  mouth.name = req.name ? req.name : null;
  mouth.thumbnail = req.thumbnail ? req.thumbnail : null;
  mouth.note = req.note ? req.note : null;
  mouth.entry_date = req.entry_date ? req.entry_date : Date.now();
  mouth.created_by = req.created_by ? req.created_by : null;
  mouth.patient = req.patient ? req.patient : null;
  return await mouth.save();
};
module.exports.insertWithFrames = async function (req) {
  let mouth = new MouthModel();
  mouth.name = req.name ? req.name : null;
  mouth.thumbnail = req.thumbnail ? req.thumbnail : null;
  mouth.note = req.note ? req.note : null;
  mouth.entry_date = req.entry_date ? req.entry_date : Date.now();
  mouth.created_by = req.created_by ? req.created_by : null;
  mouth.patient = req.patient ? req.patient : null;
  const insertedMouth = await mouth.save();
  let inseredFrameList = [];
  for (const frame of req.frames) {
    const insertedFrame = await FrameModel.insertWithMountId(
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
  mouth.note = req.note !== undefined ? req.note : mouth.note;
  mouth.entry_date = req.entry_date ? req.entry_date : mouth.entry_date;
  mouth.created_by =
    req.created_by !== undefined ? req.created_by : mouth.created_by;
  mouth.patient = req.patient !== undefined ? req.patient : mouth.patient;
  return await mouth.save();
};
