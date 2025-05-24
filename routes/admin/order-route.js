const express = require("express");
const Router = express.Router();
const controllers = require("../../controllers/admin/order-controller");

// admin/order/....

Router.get("/", controllers.index);

Router.get("/:orderId", controllers.detail);

Router.post("/delete/:orderId", controllers.delete);

Router.get("/edit/:orderId", controllers.editGet);
Router.post("/edit/:orderId", controllers.editPost);

module.exports = Router;
