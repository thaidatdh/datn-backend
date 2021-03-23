let router = require("express").Router();
let procedureController = require("../controllers/procedure.code.controller");
router
  .route("/category")
  .get(procedureController.index_category)
  .post(procedureController.add_category);
router
  .route("/category/:category_id")
  .get(procedureController.category_by_id)
  .post(procedureController.update_category)
  .delete(procedureController.delete_category);
router.route("/").get(procedureController.index).post(procedureController.add);
router
  .route("/:procedure_id")
  .get(procedureController.procedure_by_id)
  .post(procedureController.update_procedure)
  .delete(procedureController.delete_procedure);
module.exports = router;
