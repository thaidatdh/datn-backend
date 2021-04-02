let router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
let noteMacroController = require("../controllers/note.macro.controller");
router.route("/").get(noteMacroController.index).post(noteMacroController.add);
router
  .route("/:note_id")
  .get(noteMacroController.detail)
  .patch(noteMacroController.update)
  .delete(noteMacroController.delete);
module.exports = router;
