let router = require("express").Router();
let drugController = require("../controllers/drug.controller");
router.route("/").get(drugController.index)
                .post(drugController.add);

module.exports = router;