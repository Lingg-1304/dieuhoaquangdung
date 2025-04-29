const express = require("express");
const Router = express.Router();
const controllers = require("../../controllers/admin/cart-controller");

Router.get("/", controllers.index);

Router.post("/change-status/:status/:id", controllers.changeStatus);

Router.get("/detail/:id", controllers.detail);

module.exports = Router;
