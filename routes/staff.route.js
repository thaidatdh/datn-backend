let router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
let staffController = require("../controllers/staff.controller");
router.route("/").get(staffController.index).post(staffController.add);
router
  .route("/:staff_id")
  .get(staffController.staff)
  .patch(staffController.update)
  .delete(staffController.delete);

router.route("/staff").get(staffController.index_staff);
router.route("/provider").get(staffController.index_provider);
module.exports = router;
