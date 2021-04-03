let router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
let noteMacroController = require("../controllers/note.macro.controller");
router.route("/medical-alert").get(noteMacroController.medical_alert_index);
router.route("/treatment").get(noteMacroController.treatment_note_index);
router.route("/progress-note").get(noteMacroController.back_note_index);
router.route("/").get(noteMacroController.index).post(noteMacroController.add);
router
  .route("/:note_id")
  .get(noteMacroController.detail)
  .patch(noteMacroController.update)
  .delete(noteMacroController.delete);
module.exports = router;
