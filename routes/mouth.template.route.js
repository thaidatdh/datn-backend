let router = require("express").Router();
let MouthTemplateController = require("../controllers/mouth.template.controller");
router.route("/").get(MouthTemplateController.index).post(MouthTemplateController.add);
router
  .route("/:mouth_id")
  .get(MouthTemplateController.detail)
  .post(MouthTemplateController.update)
  .delete(MouthTemplateController.delete);

router.route("/frame").post(MouthTemplateController.add_frame);
router
  .route("/frame/:frame_id")
  .get(MouthTemplateController.detail_frame)
  .post(MouthTemplateController.update_frame)
  .delete(MouthTemplateController.delete_frame);
module.exports = router;
