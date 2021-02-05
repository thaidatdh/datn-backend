let router = require("express").Router();
let appointmentController = require("../controllers/appointment.controller");
router.route("/chair").get(appointmentController.chair_index)
                .post(appointmentController.add_chair);
router.route("/").get(appointmentController.appointments_index);
router
  .route("/:appointment_id")
  .get(appointmentController.appointment_info);
router.route("/patient/:patient_id").get(appointmentController.appointments_of_patient);
module.exports = router;