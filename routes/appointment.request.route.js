let router = require("express").Router();
let requestController = require("../controllers/appointment.request.controller");
router.route("/").get(requestController.index).post(requestController.add);
router
  .route("/:request_id")
  .get(requestController.apptRequest)
  .patch(requestController.update)
  .delete(requestController.delete);
router.route("/patient/:patient_id").get(requestController.patient_request);
module.exports = router;