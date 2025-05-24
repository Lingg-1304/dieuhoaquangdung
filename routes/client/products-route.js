const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/client/products-controller");
const multer = require("multer");
const upload = multer();
// ---> /products/.....

router.get("/", controllers.getProducts);

router.get("/:slug", controllers.getDetail);
router.post("/:slug", controllers.postDetail);

module.exports = router;
