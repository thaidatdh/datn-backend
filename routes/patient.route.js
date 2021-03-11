let router = require("express").Router();
let patientController = require("../controllers/patient.controller");
router.route("/").get(patientController.index).post(patientController.add);
router
  .route("/:patient_id")
  .get(patientController.patient)
  .post(patientController.update)
  .delete(patientController.delete);
module.exports = router;
