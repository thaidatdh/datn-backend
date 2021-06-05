let router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
let paymentController = require("../controllers/payment.controller");

router.route("/momo-wallet").get(paymentController.generateQrCode);
router
  .route("/momo-wallet/callback")
  .post(paymentController.callbackNotifyMomo);

module.exports = router;
