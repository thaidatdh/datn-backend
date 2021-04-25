let router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
let ProviderScheduleController = require("../controllers/provider.schedule.controller");
router
  .route("/provider/:provider_id/:date")
  .get(ProviderScheduleController.check_if_provider_working);
router
  .route("/provider/:provider_id")
  .get(ProviderScheduleController.schedule_of_provider);
router
  .route("/providers/:date")
  .get(ProviderScheduleController.providers_has_schedule);
router
  .route("/")
  .get(ProviderScheduleController.index)
  .post(ProviderScheduleController.add);
router
  .route("/:schedule_id")
  .get(ProviderScheduleController.detail)
  .patch(ProviderScheduleController.update)
  .delete(ProviderScheduleController.delete);

module.exports = router;
