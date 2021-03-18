let router = require("express").Router();
let recallController = require("../controllers/recall.controller");
router.route("/").get(recallController.index).post(recallController.add);
router
  .route("/:recall_id")
  .get(recallController.detail)
  .post(recallController.update)
  .delete(recallController.delete);
router.route("/patient/:patient_id").get(recallController.patient_recall);
module.exports = router;
