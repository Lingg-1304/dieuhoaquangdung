const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/client/cart-controller");

// /cart....

router.get("/", controllers.index);

router.post("/order", controllers.order);
router.post("/buy", controllers.buy);
router.post("/remove/:slug", controllers.remove);

module.exports = router;
