let router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
let referralSourceController = require("../controllers/referral.source.controller");
router.route("/auto-complete").get(referralSourceController.autocomplete);
router
  .route("/")
  .get(referralSourceController.index)
  .post(referralSourceController.add);
router
  .route("/:source_id")
  .get(referralSourceController.source)
  .patch(referralSourceController.update)
  .delete(referralSourceController.delete);
module.exports = router;
