let router = require("express").Router();
let authController = require("../controllers/auth.controller");
router.route("/signin").post(authController.signin_staff);
router.route("/patient/signin").post(authController.signin_patient);
module.exports = router;
