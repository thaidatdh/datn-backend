let router = require("express").Router();
let staffController = require("../controllers/staff.controller");
router
  .route("/")
  .get(staffController.index)
  .post(staffController.add);
router.route("/staff").get(staffController.index_staff);
router.route("/provider").get(staffController.index_provider);
module.exports = router;