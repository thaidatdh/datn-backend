let router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
let appointmentController = require("../controllers/appointment.controller");
router
  .route("/block")
  .get(appointmentController.block_index)
  .post(appointmentController.add_block);
router
  .route("/block/:appointment_block_id")
  .get(appointmentController.block_info)
  .patch(appointmentController.update_block)
  .delete(appointmentController.delete_block);
router
  .route("/chair")
  .get(appointmentController.chair_index)
  .post(appointmentController.add_chair);
router
  .route("/chair/:chair_id")
  .get(appointmentController.chair_info)
  .patch(appointmentController.update_chair)
  .delete(appointmentController.delete_chair);
router
  .route("/patient/:patient_id")
  .get(appointmentController.appointments_of_patient);
router
  .route("/")
  .get(appointmentController.appointments_index)
  .post(appointmentController.add_appointment);
router
  .route("/:appointment_id")
  .get(appointmentController.appointment_info)
  .patch(appointmentController.update_appointment)
  .delete(appointmentController.delete_appointment);
module.exports = router;
