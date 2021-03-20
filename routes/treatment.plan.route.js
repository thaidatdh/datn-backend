let router = require("express").Router();
let TreatmentPlanController = require("../controllers/treatment.plan.controller");
router.route("/").get(TreatmentPlanController.index).post(TreatmentPlanController.add);
router
  .route("/:plan_id")
  .get(TreatmentPlanController.detail)
  .post(TreatmentPlanController.update)
  .delete(TreatmentPlanController.delete);
router.route("/patient/:patient_id").get(TreatmentPlanController.patient_treatment_plan);
module.exports = router;
