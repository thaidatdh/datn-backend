let router = require("express").Router();
let holidayController = require("../controllers/holiday.controller");
router.route("/").get(holidayController.index)
                .post(holidayController.add);

module.exports = router;