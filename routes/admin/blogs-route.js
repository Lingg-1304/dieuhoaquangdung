const express = require("express");
const Router = express.Router();
const controllers = require("../../controllers/admin/blogs-controller");

// Upload file
const storage = require("../../helpers/storageMulter");
const multer = require("multer");
const upload = multer({ storage: storage() });

// truyền vào [GET] res.render("...",{currentPath: req.path,})
// ---> /admin/blogs/....

Router.get("/", controllers.index);

Router.get("/create", controllers.createGet);
Router.post("/create", upload.single("thumbnail"), controllers.createPost);

module.exports = Router;
