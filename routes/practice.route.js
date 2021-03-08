let router = require("express").Router();
let practiceController = require("../controllers/practice.controller");
router.route("/").get(practiceController.index).post(practiceController.add);
router.route("/:practice_id").post(practiceController.update);
module.exports = router;
