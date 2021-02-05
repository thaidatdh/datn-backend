//Import User Model
const mongoose = require("mongoose");
const documentCategoryModel = require("../models/document.category.model");
//For index
exports.index = async function (req, res) {
  try {
    const categories = await documentCategoryModel.find();
    res.json({
      success: true,
      categories: categories,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Get document category list failed",
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    let category = new documentCategoryModel();
    category.name = req.body.name;
    const rs = await category.save();
    return res.json({ success: true, category: rs });
  } catch (err) {
    return res.json({
      success: false,
      message: "Insert document category failed",
      exeption: err,
    });
  }
};
