let router = require("express").Router();
let patientController = require("../controllers/patient.controller");
router.route("/").get(patientController.index)
                .post(patientController.add);
router.route("/:patient_id").post(patientController.update);
module.exports = router;