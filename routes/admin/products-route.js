const express = require("express");
const Router = express.Router();
const controllers = require("../../controllers/admin/products-controller");

// Upload file -->
// (up local)
const storage = require("../../helpers/storageMulter");
const multer = require("multer");
const upload = multer({ storage: storage() });

// (up online)
// const fileUpload = multer();
// const uploadCloud = require("../../middlewares/admin/uploadCloud-middleware");

// truyền vào [GET] res.render("...",{currentPath: req.path,})
// ---> /admin/products/....

Router.get("/", controllers.index);

Router.post("/change-status/:status/:id", controllers.changeStatus);

Router.get("/create", controllers.createGet);
Router.post("/create", upload.single("thumbnail"), controllers.createPost);

Router.get("/edit/:id", controllers.editGet);
Router.post("/edit/:id", upload.single("thumbnail"), controllers.editPost);

Router.delete("/delete/:id", controllers.deleteProduct);

Router.get("/crop", async (req, res) => {
  res.render("admin/pages/products/crop", {
    title: "Crop",
    currentPath: req.path,
  });
});
Router.post("/crop", upload.single("croppedImage"), async (req, res) => {
  const imageUrl = `/uploads/${req.file.filename}`;
  res.send(
    `Upload thành công! <br><img src="${imageUrl}" style="max-width: 100%;">`
  );
});

module.exports = Router;
