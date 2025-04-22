const express = require("express");
const Router = express.Router();
const controllers = require("../../controllers/admin/products-controller");

// Upload file --> (up local)// const storage = require("../../helpers/storageMulter");
const multer = require("multer");
const fileUpload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud-middleware");

// truyền vào [GET] res.render("...",{currentPath: req.path,})
// ---> /admin/products/....

Router.get("/", controllers.index);

Router.post("/change-status/:status/:id", controllers.changeStatus);

Router.get("/create", controllers.createGet);
Router.post(
  "/create",
  fileUpload.single("thumbnail"),
  uploadCloud.upload,
  controllers.createPost
);

Router.get("/edit/:id", controllers.editGet);
Router.post(
  "/edit/:id",
  fileUpload.single("thumbnail"),
  uploadCloud.upload,
  controllers.editPost
);

Router.delete("/delete/:id", controllers.deleteProduct);

module.exports = Router;
