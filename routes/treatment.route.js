let router = require("express").Router();
let TreatmentController = require("../controllers/treatment.controller");
router.route("/").get(TreatmentController.index).post(TreatmentController.add);
router
  .route("/:treatment_id")
  .get(TreatmentController.detail)
  .post(TreatmentController.update)
  .delete(TreatmentController.delete);
router.route("/patient/:patient_id").get(TreatmentController.patient_treatment);
router
  .route("/patient/:patient_id/:plan_id")
  .get(TreatmentController.patient_treatment_plan);
module.exports = router;
