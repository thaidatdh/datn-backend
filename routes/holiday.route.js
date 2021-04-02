let router = require("express").Router();
let holidayController = require("../controllers/holiday.controller");
const authMiddleware = require("../middlewares/auth.middleware");
router.route("/").get(holidayController.index).post(holidayController.add);

module.exports = router;
