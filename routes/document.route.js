let router = require("express").Router();
let documentController = require("../controllers/document.controller");
let documentCategoryController = require("../controllers/document.category.controller");

router.route("/").get(documentController.index).post(documentController.add);
router.route("/practice").get(documentController.practice_document);
router.route("/patient/:patient_id").get(documentController.patient_document);

router
  .route("/category")
  .get(documentCategoryController.index)
  .post(documentCategoryController.add);
module.exports = router;
