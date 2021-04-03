//Import User Model
const mongoose = require("mongoose");
const constants = require("../constants/constants");
const procedureModel = require("../models/procedure.code.model");
const categoryModel = require("../models/procedure.category.model");
const translator = require("../utils/translator");
//For index
exports.index = async function (req, res) {
  try {
    const options = {
      limit: req.query.limit,
      page: req.query.page,
    };
    const procedure_codes = await procedureModel.get({}, options);
    let result = {
      success: true,
      payload: procedure_codes,
    };
    if (options.page && options.limit) {
      const totalCount = await procedureModel.estimatedDocumentCount();
      const limit = Number.parseInt(options.limit);
      const page = Number.parseInt(options.page);
      result = Object.assign(result, {
        page: page,
        limit: limit,
        total_page: Math.ceil(totalCount / limit),
      });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "procedure code list",
        req.query.lang
      ),
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
      message: await translator.FailedMessage(
        constants.ACTION.INSERT,
        "procedure code",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.procedure_by_category_id = async function (req, res) {
  try {
    const options = {
      limit: req.query.limit,
      page: req.query.page,
    };
    const procedure_codes = await procedureModel.get(
      { category: req.params.category_id },
      options
    );
    let result = {
      success: true,
      payload: procedure_codes,
    };
    if (options.page && options.limit) {
      const totalCount = await procedureModel.countDocuments({
        category: req.params.category_id,
      });
      const limit = Number.parseInt(options.limit);
      const page = Number.parseInt(options.page);
      result = Object.assign(result, {
        page: page,
        limit: limit,
        total_page: Math.ceil(totalCount / limit),
      });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "Procedure",
        req.query.lang
      ),
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
        message: await translator.NotFoundMessage("Procedure", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "Procedure",
        req.query.lang
      ),
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
        message: await translator.NotFoundMessage("Procedure", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "Procedure",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.delete_procedure = async function (req, res) {
  try {
    await procedureModel.deleteOne({ _id: req.params.procedure_id });
    res.json({
      success: true,
      message: await translator.DeleteMessage(req.query.lang),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.DELETE,
        "Procedure",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
//category
//For index
exports.index_category = async function (req, res) {
  try {
    const options = {
      get_codes: req.query.get_codes == "true",
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
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "procedure category list",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.category_by_id = async function (req, res) {
  try {
    const options = {
      get_codes: req.query.get_codes == "true",
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
    } else {
      res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage("Category", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "procedure category",
        req.query.lang
      ),
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
      message: await translator.FailedMessage(
        constants.ACTION.INSERT,
        "procedure category",
        req.query.lang
      ),
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
        message: await translator.NotFoundMessage("Category", req.query.lang),
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.UPDATE,
        "Procedure Category",
        req.query.lang
      ),
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
      message: await translator.DeleteMessage(req.query.lang),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.DELETE,
        "Procedure Category",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
