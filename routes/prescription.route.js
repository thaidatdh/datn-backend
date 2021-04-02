let router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
let PrescriptionController = require("../controllers/prescription.controller");
router
  .route("/patient/:patient_id")
  .get(PrescriptionController.patient_prescription);
router
  .route("/detail/:detail_id")
  .get(PrescriptionController.detail_detail)
  .patch(PrescriptionController.update_detail)
  .delete(PrescriptionController.delete_detail);
router
  .route("/")
  .get(PrescriptionController.index)
  .post(PrescriptionController.add);
router
  .route("/:prescription_id")
  .get(PrescriptionController.detail)
  .patch(PrescriptionController.update)
  .delete(PrescriptionController.delete);
router
  .route("/:prescription_id/detail")
  .post(PrescriptionController.add_detail);
module.exports = router;
