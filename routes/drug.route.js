let router = require("express").Router();
let drugController = require("../controllers/drug.controller");
router.route("/").get(drugController.index).post(drugController.add);
router.route("/:drug_id").get(drugController.drug).post(drugController.update);
module.exports = router;
