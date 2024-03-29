let router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
let documentController = require("../controllers/document.controller");
let documentCategoryController = require("../controllers/document.category.controller");
router
  .route("/category")
  .get(documentCategoryController.index)
  .post(documentCategoryController.add);
router
  .route("/category/:category_id")
  .get(documentCategoryController.detail)
  .patch(documentCategoryController.update)
  .delete(documentCategoryController.delete);
router.route("/practice").get(documentController.practice_document);
router.route("/patient/:patient_id").get(documentController.patient_document);
router.route("/").get(documentController.index).post(documentController.add);
router
  .route("/:document_id")
  .get(documentController.detail)
  .patch(documentController.update)
  .delete(documentController.delete);

module.exports = router;
