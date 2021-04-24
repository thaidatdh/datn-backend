let router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
let authController = require("../controllers/auth.controller");
router.route("/signin").post(authController.signin_staff);
router.route("/change-password").post(authController.change_password);
router.route("/refresh-token").post(authController.refresh_token);
router.route("/patient/signin").post(authController.signin_patient);
module.exports = router;
