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
      payload: procedure_codes,
    });
  } catch (err) {
    res.status(500).json({
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
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Insert procedure code failed",
      exeption: err,
    });
  }
};
exports.procedure_by_id = async function (req, res) {
  try {
    const procedure = await procedureModel.findById(req.params.procedure_id);
    if (procedure) {
      res.json({
        success: true,
        payload: procedure,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Procedure not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Find Procedure failed",
      exeption: err,
    });
  }
};
exports.update_procedure = async function (req, res) {
  try {
    const procedureInfo = req.body;
    const procedure = await procedureModel.findById(req.params.procedure_id);
    if (procedure) {
      const result = await procedureModel.updateProcedure(
        procedure,
        procedureInfo
      );
      res.json({
        success: true,
        payload: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Procedure not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Find Procedure failed",
      exeption: err,
    });
  }
};
exports.delete_procedure = async function (req, res) {
  try {
    await procedureModel.deleteOne({ _id: req.params.procedure_id });
    res.json({
      success: true,
      message: "Delete Successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Delete failed",
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
      payload: result,
    });
  } catch (err) {
    res.status(500).json({
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
    if (category) {
      const result =
        category && category.length > 0
          ? Object.assign({}, category[0]._doc)
          : null;
      if (options.get_codes && result) {
        result.procedure_code = category.procedure_code;
      }
      res.json({
        success: true,
        payload: result,
      });
    }
    else {
      res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
  } catch (err) {
    res.status(500).json({
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
    return res.json({ success: true, payload: rs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Insert procedure category failed",
      exeption: err,
    });
  }
};
exports.update_category = async function (req, res) {
  try {
    const category = await categoryModel.findById(req.params.category_id);
    if (category) {
      category.name =
        req.body.name !== undefined ? req.body.name : category.name;
      category.icon =
        req.body.icon !== undefined ? req.body.icon : category.icon;
      res.json({
        success: true,
        payload: category,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Category not found",
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
exports.delete_category = async function (req, res) {
  try {
    await categoryModel.deleteOne({ _id: req.params.category_id });
    await procedureModel.updateMany(
      { category: req.params.category_id },
      { $set: { category: null } }
    );
    res.json({
      success: true,
      message: "Delete Successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Delete failed",
      exeption: err,
    });
  }
};
