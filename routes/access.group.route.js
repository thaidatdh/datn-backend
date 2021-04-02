let router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
let accessController = require("../controllers/access.group.controller");
router.route("/").get(accessController.index).post(accessController.add);

module.exports = router;
