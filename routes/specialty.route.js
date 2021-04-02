let router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
let specialtyController = require("../controllers/specialty.controller");
router
  .route("/")
  .get(specialtyController.index)
  .post(specialtyController.add);
router
  .route("/:specialty_id")
  .get(specialtyController.specialty)
  .patch(specialtyController.update)
  .delete(specialtyController.delete);
module.exports = router;
