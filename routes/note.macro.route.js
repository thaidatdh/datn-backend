let router = require("express").Router();
let noteMacroController = require("../controllers/note.macro.controller");
router.route("/").get(noteMacroController.index)
                .post(noteMacroController.add);

module.exports = router;