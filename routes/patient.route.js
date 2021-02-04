let router = require("express").Router();
let patientController = require("../controllers/patient.controller");
router.route("/").get(patientController.index)
                .post(patientController.add);

module.exports = router;