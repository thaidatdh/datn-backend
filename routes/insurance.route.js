//deprecated
let router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
let insuranceController = require("../controllers/insurance.controller");
router.route("/").get(insuranceController.index).post(insuranceController.add);
router
  .route("/:insurance_id")
  .get(insuranceController.detail)
  .patch(insuranceController.update)
  .delete(insuranceController.delete);
router.route("/patient/:patient_id").get(insuranceController.patient_insurance);
module.exports = router;
