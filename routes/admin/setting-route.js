const express = require("express");
const Router = express.Router();
const controllers = require("../../controllers/admin/products-controller");
// Upload file -->
const upload = require("../../middlewares/admin/upload"); // dùng memoryStorage

module.exports = Router;
