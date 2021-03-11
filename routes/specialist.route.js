let router = require("express").Router();
let specialistController = require("../controllers/specialist.controller");
router.route("/").get(specialistController.index)
                .post(specialistController.add);
router
  .route("/:specialist_id")
  .get(specialistController.specialist)
  .post(specialistController.update)
  .delete(specialistController.delete);
module.exports = router;