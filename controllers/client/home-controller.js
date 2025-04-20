const Product = require("../../models/product-model");

module.exports.index = (req, res) => {
  res.render("client/pages/home/index", { title: "Trang chủ" });
};
