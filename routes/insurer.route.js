let router = require("express").Router();
let insurerController = require("../controllers/insurer.controller");
const authMiddleware = require("../middlewares/auth.middleware");
router
  .route("/")
  .get(insurerController.index)
  .post(insurerController.add);
router
  .route("/:insurer_id")
  .get(insurerController.insurer)
  .patch(insurerController.update)
  .delete(insurerController.delete);
module.exports = router;
