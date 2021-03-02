let router = require("express").Router();
let procedureController = require("../controllers/procedure.code.controller");
router.route("/").get(procedureController.index).post(procedureController.add);
router
  .route("/category")
  .get(procedureController.index_category)
  .post(procedureController.add_category);
router.route("/category/:category_id").get(procedureController.category_by_id);
module.exports = router;
