let router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
let MouthController = require("../controllers/mouth.controller");
router.route("/patient/:patient_id").get(MouthController.patient_mouth);
router
  .route("/frame/:frame_id")
  .get(MouthController.detail_frame)
  .patch(MouthController.update_frame)
  .delete(MouthController.delete_frame);
router.route("/").get(MouthController.index).post(MouthController.add);
router
  .route("/:mouth_id")
  .get(MouthController.detail)
  .patch(MouthController.update)
  .delete(MouthController.delete);
router.route("/:mouth_id/frame").post(MouthController.add_frame);
module.exports = router;
