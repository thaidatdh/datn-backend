let router = require("express").Router();
let MultiCodeController = require("../controllers/multicode.controller");
router.route("/").get(MultiCodeController.index).post(MultiCodeController.add);
router.route("/:multicode_id").get(MultiCodeController.detail);
module.exports = router;
