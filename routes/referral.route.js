let router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
let referralController = require("../controllers/referral.controller");
router.route("/").get(referralController.index).post(referralController.add);
router
  .route("/:referral_id")
  .get(referralController.detail)
  .patch(referralController.update)
  .delete(referralController.delete);
router.route("/patient/:patient_id").get(referralController.patient_referral);
module.exports = router;
