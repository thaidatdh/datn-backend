const mongoose = require("mongoose");
const constants = require("../constants/constants");
const Patient = require("./patient.model");
const ImagesSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Types.ObjectId,
      ref: "patient",
      required: false,
    },
    image_path: String,
    thumbnail_path: String,
  },
  {
    timestamps: true,
    collection: "images",
  }
);

const ImageModel = (module.exports = mongoose.model("image", ImagesSchema));

module.exports.get = async function (query, populateOptions) {
  populateOptions = populateOptions || {};
  const promise = ImageModel.find(query);
  // Limit
  if (populateOptions.limit) {
    promise.limit(Number.parseInt(populateOptions.limit));
  }
  const resultQuery = await promise.exec();
  return resultQuery;
};

module.exports.insert = async function (imageInfo) {
  let image = new ImageModel();
  image.patient = imageInfo.patient ? imageInfo.patient : null;
  image.image_path = imageInfo.image_path ? imageInfo.image_path : null;
  image.thumbnail_path = imageInfo.thumbnail_path
    ? imageInfo.thumbnail_path
    : null;
  return await image.save();
};
module.exports.updateImage = async function (image, imageInfo) {
  image.patient =
    imageInfo.patient !== undefined ? imageInfo.patient : image.patient;
  image.image_path = imageInfo.image_path
    ? imageInfo.image_path
    : image.image_path;
  image.thumbnail_path = imageInfo.thumbnail_path
    ? imageInfo.thumbnail_path
    : image.thumbnail_path;
  return await image.save();
};
