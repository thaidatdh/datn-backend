let router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
let procedureController = require("../controllers/procedure.code.controller");
router
  .route("/category")
  .get(procedureController.index_category)
  .post(procedureController.add_category);
router
  .route("/category/:category_id")
  .get(procedureController.category_by_id)
  .patch(procedureController.update_category)
  .delete(procedureController.delete_category);
router.route("/by_category/:category_id").get(procedureController.procedure_by_category_id);
router.route("/").get(procedureController.index).post(procedureController.add);
router
  .route("/:procedure_id")
  .get(procedureController.procedure_by_id)
  .patch(procedureController.update_procedure)
  .delete(procedureController.delete_procedure);
module.exports = router;
