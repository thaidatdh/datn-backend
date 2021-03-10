let router = require("express").Router();
let insurerController = require("../controllers/insurer.controller");
router.route("/").get(insurerController.index).post(insurerController.add);
router
  .route("/:insurer_id")
  .get(insurerController.insurer)
  .post(insurerController.update)
  .delete(insurerController.delete);
module.exports = router;