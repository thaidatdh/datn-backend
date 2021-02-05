let router = require("express").Router();
let referralSourceController = require("../controllers/referral.source.controller");
router.route("/").get(referralSourceController.index)
                .post(referralSourceController.add);

module.exports = router;