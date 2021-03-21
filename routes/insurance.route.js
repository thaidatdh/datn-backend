let router = require("express").Router();
let insuranceController = require("../controllers/insurance.controller");
router.route("/").get(insuranceController.index).post(insuranceController.add);
router
  .route("/:insurance_id")
  .get(insuranceController.detail)
  .post(insuranceController.update)
  .delete(insuranceController.delete);
router.route("/patient/:patient_id").get(insuranceController.patient_insurance);
module.exports = router;
