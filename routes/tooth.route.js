let router = require("express").Router();
let toothController = require("../controllers/tooth.controller");
router.route("/patient/:patient_id").get(toothController.patient);
router
  .route("/patient/:patient_id/:tooth_number")
  .get(toothController.patient_tooth_by_number)
  .post(toothController.update_patient_tooth_by_number);
router.route("/").get(toothController.index).post(toothController.add);
router
  .route("/:tooth_id")
  .get(toothController.tooth)
  .post(toothController.update)
  .delete(toothController.delete);
module.exports = router;
