
let router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
let ProviderScheduleController = require("../controllers/provider.schedule.controller");
router
  .route("/provider/:provider_id")
  .get(ProviderScheduleController.schedule_of_provider);
router
  .route("/")
  .get(ProviderScheduleController.index)
  .post(ProviderScheduleController.add);
router
  .route("/:recall_id")
  .get(ProviderScheduleController.detail)
  .patch(ProviderScheduleController.update)
  .delete(ProviderScheduleController.delete);

module.exports = router;
