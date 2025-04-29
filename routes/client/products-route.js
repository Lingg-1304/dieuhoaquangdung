const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/client/products-controller");

// ---> /products/.....

router.get("/", controllers.getProducts);

router.get("/:slug", controllers.getDetail);

router.get("/:slug/buy", controllers.getBuy);
router.post("/:slug/buy", controllers.postBuy);

router.post("/:slug/add-to-cart", controllers.postAddToCart);

module.exports = router;
