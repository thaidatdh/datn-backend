let router = require("express").Router();
let documentCategoryController = require("../controllers/document.category.controller");
router.route("/").get(documentCategoryController.index)
                .post(documentCategoryController.add);

module.exports = router;