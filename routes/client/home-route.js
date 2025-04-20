const express = require("express");
const Router = express.Router();
const controllers = require("../../controllers/client/home-controller");

Router.get("/", controllers.index);

module.exports = Router;
