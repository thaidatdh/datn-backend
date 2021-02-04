let router = require("express").Router();
let staffController = require("../controllers/staff.controller");
router
  .route("/")
  .post(staffController.index_staff)
  .put(staffController.add);

module.exports = router;