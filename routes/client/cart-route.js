const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/client/cart-controller");

router.get("/", controllers.index);

router.post("/order", controllers.order);
router.post("/buy", controllers.buy);

module.exports = router;
