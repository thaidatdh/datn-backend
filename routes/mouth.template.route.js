let router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
let MouthTemplateController = require("../controllers/mouth.template.controller");
router.route("/frame").post(MouthTemplateController.add_frame);
router
  .route("/frame/:frame_id")
  .get(MouthTemplateController.detail_frame)
  .patch(MouthTemplateController.update_frame)
  .delete(MouthTemplateController.delete_frame);
router
  .route("/")
  .get(MouthTemplateController.index)
  .post(MouthTemplateController.add);
router
  .route("/:mouth_id")
  .get(MouthTemplateController.detail)
  .patch(MouthTemplateController.update)
  .delete(MouthTemplateController.delete);

module.exports = router;
