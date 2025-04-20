const express = require("express");
const Router = express.Router();
const controllers = require("../../controllers/admin/products-controller");

// Upload file
const storage = require("../../helpers/storageMulter");
const multer = require("multer");
const upload = multer({ storage: storage() });

// truyền vào [GET] res.render("...",{currentPath: req.path,})
// ---> /admin/products/....

Router.get("/", controllers.index);

Router.post("/change-status/:status/:id", controllers.changeStatus);

Router.get("/create", controllers.createGet);
Router.post("/create", upload.single("thumbnail"), controllers.createPost);

Router.get("/edit/:id", controllers.editGet);
Router.post("/edit/:id", upload.single("thumbnail"), controllers.editPost);

Router.delete("/delete/:id", controllers.deleteProduct);

module.exports = Router;
