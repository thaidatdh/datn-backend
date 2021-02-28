let router = require("express").Router();
let appointmentController = require("../controllers/appointment.controller");
router
  .route("/chair")
  .get(appointmentController.chair_index)
  .post(appointmentController.add_chair);
router
  .route("/")
  .get(appointmentController.appointments_index)
  .post(appointmentController.add_appointment);
router
  .route("/:appointment_id")
  .get(appointmentController.appointment_info)
  .post(appointmentController.update_appointment);
router
  .route("/patient/:patient_id")
  .get(appointmentController.appointments_of_patient);

router
  .route("/block")
  .get(appointmentController.block_index)
  .post(appointmentController.add_appointmentblock);
router
  .route("/block/:appointment_block_id")
  .get(appointmentController.appointmentblock_info)
  .post(appointmentController.update_appointmentblock);
module.exports = router;
