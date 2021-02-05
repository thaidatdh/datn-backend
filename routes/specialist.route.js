let router = require("express").Router();
let specialistController = require("../controllers/specialist.controller");
router.route("/").get(specialistController.index)
                .post(specialistController.add);

module.exports = router;