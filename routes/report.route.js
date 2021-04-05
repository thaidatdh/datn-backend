let router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
let reportController = require("../controllers/report.controller");
router.route("/").get(reportController.index);
router.route("/treatment-history/:patient_id").get(reportController.report_treatment_history);
module.exports = router;
