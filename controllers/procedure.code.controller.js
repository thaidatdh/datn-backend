//Import User Model
const mongoose = require("mongoose");
const procedureModel = require("../models/procedure.code.model");
const categoryModel = require("../models/procedure.category.model");
const translator = require("../utils/translator");
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
      message: await translator.Translate("Get procedure code list failed", req.query.lang),
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
      message: await translator.Translate("Insert procedure code failed", req.query.lang),
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
        message: await translator.Translate("Procedure not found", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Find Procedure failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.update_procedure = async function (req, res) {
  try {
    const procedureInfo = req.body;
    let procedure = await procedureModel.findById(req.params.procedure_id);
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
        message: await translator.Translate("Procedure not found", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Find Procedure failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.delete_procedure = async function (req, res) {
  try {
    await procedureModel.deleteOne({ _id: req.params.procedure_id });
    res.json({
      success: true,
      message: await translator.Translate("Delete Successfully", req.query.lang),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Delete failed", req.query.lang),
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
        result[i].procedure_code = [...categories[i].procedure_code];
      }
    }
    res.json({
      success: true,
      payload: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Get procedure category list failed", req.query.lang),
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
        result.procedure_code = [...category.procedure_code];
      }
      res.json({
        success: true,
        payload: result,
      });
    }
    else {
      res.status(404).json({
        success: false,
        message: await translator.Translate("Category not found", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Get procedure category failed", req.query.lang),
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
      message: await translator.Translate("Insert procedure category failed", req.query.lang),
      exeption: err,
    });
  }
};
exports.update_category = async function (req, res) {
  try {
    let category = await categoryModel.findById(req.params.category_id);
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
        message: await translator.Translate("Category not found", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message:  await translator.Translate("Update failed", req.query.lang),
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
      message: await translator.Translate("Delete Successfully", req.query.lang),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.Translate("Delete failed", req.query.lang),
      exeption: err,
    });
  }
};
