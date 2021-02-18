//Import User Model
const mongoose = require("mongoose");
const procedureModel = require("../models/procedure.code.model");
const categoryModel = require("../models/procedure.category.model");
//For index
exports.index = async function (req, res) {
  try {
    const procedure_codes = await procedureModel.find();
    res.json({
      success: true,
      procedure_codes: procedure_codes,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Get procedure code list failed",
      exeption: err,
    });
  }
};
exports.add = async function (req, res) {
  try {
    const procedureCodeInfo = req.body;
    const rs = await procedureModel.insert(procedureCodeInfo);
    return res.json({ success: true, drug: rs });
  } catch (err) {
    return res.json({
      success: false,
      message: "Insert procedure code failed",
      exeption: err,
    });
  }
};

//category
//For index
exports.index_category = async function (req, res) {
  try {
    const options = {
      get_codes: req.query.get_codes,
      limit: req.query.limit,
    };
    const categories = await categoryModel.get({}, options);
    const result = [...categories];
    if (options.get_codes) {
      for (let i = 0; i < categories.length; i++) {
        result[i].procedure_code = categories[i].procedure_code;
      }
    }
    res.json({
      success: true,
      categories: result,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Get procedure category list failed",
      exeption: err,
    });
  }
};
exports.category_by_id = async function (req, res) {
  try {
    const options = {
      get_codes: req.query.get_codes,
    };
    const category_id = req.params.category_id;
    const category = await categoryModel.get({ _id: category_id }, options);
    const result =
      category && category.length > 0
        ? Object.assign({}, category[0]._doc)
        : null;
    if (options.get_codes && result) {
      result.procedure_code = category.procedure_code;
    }
    res.json({
      success: true,
      category: result,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Get procedure category failed",
      exeption: err,
    });
  }
};
exports.add_category = async function (req, res) {
  try {
    let category = new categoryModel();
    category.name = req.body.name ? req.body.name : null;
    category.icon = req.body.icon ? req.body.icon : null;
    const rs = await category.save();
    return res.json({ success: true, category: rs });
  } catch (err) {
    return res.json({
      success: false,
      message: "Insert procedure category failed",
      exeption: err,
    });
  }
};
