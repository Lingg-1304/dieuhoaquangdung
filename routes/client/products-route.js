const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/client/products-controller");

// ---> /products/.....

router.get("/", controllers.getProducts);

router.get("/:slug", controllers.getDetail);

module.exports = router;
