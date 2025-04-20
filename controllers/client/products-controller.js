const Product = require("../../models/product-model");

// [GET] /products
module.exports.getProducts = async (req, res) => {
  // console.log(req.query.sort);

  let sortOption;
  switch (req.query.sort) {
    case "price_asc":
      sortOption = { price: 1 };
      break;
    case "price_desc":
      sortOption = { price: -1 };
      break;
    case "popular":
      sortOption = { stock: -1 }; // hoặc trường viewCount nếu có
      break;
    case "newest" || undefined:
      sortOption = { position: -1 };
      break;
  }

  const products = await Product.find({
    deleted: false,
    status: "active",
  }).sort(sortOption);

  const newProducts = products.map((product) => {
    product.priceNew = (
      (product.price * (100 - product.discountPercentage)) /
      100
    ).toFixed(0);
    return product;
  });

  // console.log(newProducts);

  res.render("client/pages/products/index", {
    title: "Products",
    products: newProducts,
  });
};

// [GET] /products/:slug
module.exports.getDetail = async (req, res) => {
  const slug = req.params.slug;
  let find = {
    deleted: false,
    slug,
    status: "active",
  };
  const item = await Product.findOne(find);

  res.render("client/pages/products/detail", {
    title: item.title,
    product: item,
  });
};
