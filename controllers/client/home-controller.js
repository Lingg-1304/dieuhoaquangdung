const Product = require("../../models/product-model");

module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
    status: "active",
  };

  //featuredProducts
  const featuredProducts = await Product.find(find).limit(4);
  //newProducts
  const newProducts = await Product.find(find).limit(4);

  const products = await Product.find(find);
  res.render("client/pages/home/index", {
    title: "Trang chủ",
    featuredProducts,
    newProducts,
    products,
    currentPath: req.path,
  });
};
