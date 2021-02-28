let router = require("express").Router();
let imageController = require("../controllers/image.controller");
router.route("/").get(imageController.index).post(imageController.add);
router.route("/patient/:patient_id").get(imageController.image_of_patient);
module.exports = router;
