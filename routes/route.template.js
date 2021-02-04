let router = require("express").Router();
//const verifyToken = require("../middlewares/verifyToken");
//Import User Controller
let userController = require("../controllers/user.controller");

// User routes
router.route("/").get(userController.index)
  router.route("/add").get(userController.add);
  //.delete(verifyToken.verifyUser, chatController.delete_many);
//router
  //.route("/:user_id")
  //.get(verifyToken.verifyUser, chatController.view)
  //.patch(verifyToken.verifyUser, chatController.update)
  //.put(verifyToken.verifyUser, chatController.update)
  //.delete(verifyToken.verifyUser, chatController.delete);

//Export API routes

module.exports = router;