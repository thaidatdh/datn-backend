let router = require("express").Router();
let noteMacroController = require("../controllers/note.macro.controller");
router.route("/").get(noteMacroController.index).post(noteMacroController.add);
router
  .route("/:note_id")
  .get(noteMacroController.detail)
  .post(noteMacroController.update)
  .delete(noteMacroController.delete);
module.exports = router;
