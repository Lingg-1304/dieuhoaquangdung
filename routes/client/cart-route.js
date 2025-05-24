const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/client/cart-controller");
const multer = require("multer");
const upload = multer();
// /cart....

router.get("/", controllers.index);
router.get("/order", controllers.order);

router.post("/order/remove", controllers.removeOrder);
router.post("/order/edit", upload.none(), controllers.editOrder);

router.post("/buy", upload.none(), controllers.buy);
router.post("/remove/:slug", controllers.remove);

module.exports = router;
