//Import User Model
const mongoose = require("mongoose");
const documentCategoryModel = require("../models/document.category.model");
const translator = require("../utils/translator");
//For index
exports.index = async function (req, res) {
  try {
    const categories = await documentCategoryModel.find();
    res.json({
      success: true,
      payload: categories,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Get document category list failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    let category = new documentCategoryModel();
    category.name = req.body.name;
    const rs = await category.save();
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: await translator.Translate("Insert document category failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.detail = async function (req, res) {
  try {
    const category = await documentCategoryModel.findById(
      req.params.category_id
    );
    if (category) {
      res.json({
        success: true,
        payload: category,
      });
    } else {
      res.status(500).json({
        success: false,
        message: await translator.Translate("Document category not found", req.query.lang),
      });
    }
  } catch (err) {
    res.json({
      success: false,
      message: await translator.Translate("Get detail failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.update = async function (req, res) {
  try {
    const category = await documentCategoryModel.findById(
      req.params.category_id
    );
    if (category) {
      category.name = req.body.name ? req.body.name : category.name;
      const result = await category.save();
      res.json({
        success: true,
        payload: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.Translate("Document category not found", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Update failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.delete = async function (req, res) {
  try {
    const category = await documentCategoryModel.findById(
      req.params.category_id
    );
    if (category) {
      await documentCategoryModel.deleteOne({ _id: req.params.category_id });
      res.json({
        success: true,
      });
    } else {
      res.status(404).json({
        success: false,
        message: await translator.Translate("Document category not found", req.query.lang),
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
