let router = require("express").Router();
let referralSourceController = require("../controllers/referral.source.controller");
router
  .route("/")
  .get(referralSourceController.index)
  .post(referralSourceController.add);
router
  .route("/:source_id")
  .get(referralSourceController.source)
  .post(referralSourceController.update)
  .delete(referralSourceController.delete);
module.exports = router;
