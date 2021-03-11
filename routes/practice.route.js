let router = require("express").Router();
let practiceController = require("../controllers/practice.controller");
router.route("/").get(practiceController.index).post(practiceController.add);
router
  .route("/:practice_id")
  .get(practiceController.detail)
  .post(practiceController.update)
  .delete(practiceController.delete);
module.exports = router;