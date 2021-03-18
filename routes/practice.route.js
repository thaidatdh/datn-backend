let router = require("express").Router();
let practiceController = require("../controllers/practice.controller");
const authMiddleware = require("../middlewares/auth.middleware");
router
  .route("/")
  .get(practiceController.index)
  .post(authMiddleware.verifyUser, practiceController.add);
router
  .route("/:practice_id")
  .get(authMiddleware.verifyUser, practiceController.detail)
  .post(practiceController.update)
  .delete(practiceController.delete);
module.exports = router;
