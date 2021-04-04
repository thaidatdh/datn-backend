let router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
let reportController = require("../controllers/report.controller");
router.route("/").get(reportController.index);

module.exports = router;
