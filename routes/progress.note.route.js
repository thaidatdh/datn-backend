let router = require("express").Router();
let ProgressNoteController = require("../controllers/progress.note.controller");
router.route("/").get(ProgressNoteController.index).post(ProgressNoteController.add);
router
  .route("/:note_id")
  .get(ProgressNoteController.detail)
  .post(ProgressNoteController.update)
  .delete(ProgressNoteController.delete);
router.route("/patient/:patient_id").get(ProgressNoteController.patient_note);
module.exports = router;
