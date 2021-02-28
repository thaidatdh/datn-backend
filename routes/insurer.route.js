let router = require("express").Router();
let insurerController = require("../controllers/insurer.controller");
router.route("/").get(insurerController.index)
                .post(insurerController.add);

module.exports = router;