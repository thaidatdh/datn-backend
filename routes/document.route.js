let router = require("express").Router();
let documentController = require("../controllers/document.controller");
router.route("/").get(documentController.index)
                .post(documentController.add);
router.route("/practice").get(documentController.practice_document);
router.route("/patient/:patient_id").get(documentController.patient_document);

module.exports = router;