let router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
const practiceController = require("../controllers/practice.controller");
router.route("/").get(practiceController.index).post(practiceController.add);
router
  .route("/:practice_id")
  .get(practiceController.detail)
  .patch(practiceController.update)
  .delete(practiceController.delete);
module.exports = router;
