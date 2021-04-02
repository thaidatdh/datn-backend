let router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
let MultiCodeController = require("../controllers/multicode.controller");
router.route("/").get(MultiCodeController.index).post(MultiCodeController.add);
router.route("/:multicode_id").get(MultiCodeController.detail);
module.exports = router;
