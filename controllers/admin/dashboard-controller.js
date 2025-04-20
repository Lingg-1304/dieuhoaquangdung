const Product = require("../../models/product-model");

// get dashboard --> /admin/dashboard
module.exports.dashboard = async (req, res) => {
  const products = await Product.find();
  // console.log(products);
  res.render("admin/pages/dashboard/index", {
    title: "Admin dashboard",
    products: products,
    currentPath: req.path,
  });
};
