let router = require("express").Router();
const patientRouter = require("./patient.route");
const providerRouter = require("./provider.route");
const staffRouter = require("./staff.route");
router.use("/patient", patientRouter);
router.use("/provider", providerRouter);
router.use("/staff", staffRouter);
module.exports = router;
