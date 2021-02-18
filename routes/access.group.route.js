let router = require("express").Router();
let accessController = require("../controllers/access.group.controller");
router.route("/").get(accessController.index)
                .post(accessController.add);

module.exports = router;