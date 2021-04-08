let router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
let TransactionController = require("../controllers/transaction.controller");
router
  .route("/")
  .get(TransactionController.index)
  .post(TransactionController.add);
router
  .route("/:treatment_id")
  .get(TransactionController.detail)
  .patch(TransactionController.update);
router
  .route("/patient/:patient_id")
  .get(TransactionController.patient_transaction);
module.exports = router;
