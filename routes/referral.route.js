let router = require("express").Router();
let referralController = require("../controllers/referral.controller");
router.route("/").get(referralController.index)
                .post(referralController.add);
router.route("/patient/:patient_id").get(referralController.patient_referral);
module.exports = router;