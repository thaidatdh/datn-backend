let router = require("express").Router();
let practiceController = require("../controllers/practice.controller");
router.route("/").get(practiceController.index)
                .post(practiceController.add);

module.exports = router;