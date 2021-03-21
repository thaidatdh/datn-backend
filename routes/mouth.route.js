let router = require("express").Router();
let MouthController = require("../controllers/mouth.controller");
router.route("/").get(MouthController.index).post(MouthController.add);
router
  .route("/:mouth_id")
  .get(MouthController.detail)
  .post(MouthController.update)
  .delete(MouthController.delete);
router.route("/patient/:patient_id").get(MouthController.patient_mouth);

router.route("/:mouth_id/frame").post(MouthController.add_frame);
router
  .route("/frame/:frame_id")
  .get(MouthController.detail_frame)
  .post(MouthController.update_frame)
  .delete(MouthController.delete_frame);
module.exports = router;
