let router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
let drugController = require("../controllers/drug.controller");
router.route("/").get(drugController.index).post(drugController.add);
router
  .route("/:drug_id")
  .get(drugController.drug)
  .patch(drugController.update)
  .delete(drugController.delete);
module.exports = router;
