let router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
let patientController = require("../controllers/patient.controller");
router.route("/").get(patientController.index).post(patientController.add);
router
  .route("/:patient_id")
  .get(patientController.patient)
  .patch(patientController.update)
  .delete(patientController.delete);
module.exports = router;
