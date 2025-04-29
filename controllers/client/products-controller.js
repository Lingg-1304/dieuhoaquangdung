const Product = require("../../models/product-model");
const Order = require("../../models/oder-model"); // Mongoose schema
const sortOption = require("../../helpers/sortOption");
const search = require("../../helpers/search");
// [GET] /products
module.exports.getProducts = async (req, res) => {
  // console.log(req.query.sort);
  let keyword = req.query.keyword;
  let find = {
    deleted: false,
    status: "active",
  };

  // Thanh tìm kiếm
  find = search(find, keyword);

  //Thanh sắp xếp
  let sort;
  if (sortOption(req)) {
    if (sortOption(req).position && sortOption(req).position === -1) {
      sort = "Mới nhất";
    } else if (sortOption(req).price && sortOption(req).price === 1) {
      sort = "Giá: Thấp đến cao";
    } else if (sortOption(req).price && sortOption(req).price === -1) {
      sort = "Giá: Cao đến thấp";
    } else if (sortOption(req).stock && sortOption(req).stock === 1) {
      sort = "Phổ biến nhất";
    }
  }

  //Thanh hãng điều hòa
  // console.log(req.query.brand);
  const selectBrand = req.query.brand;
  if (selectBrand && selectBrand != "all") {
    find.brand = selectBrand;
  }

  // Phân trang ?page=
  const page = parseInt(req.query.page) || 1;
  const limit = 6;
  const skip = (page - 1) * limit;

  // Lọc sản phẩm
  const [products, total] = await Promise.all([
    Product.find(find).skip(skip).limit(limit).sort(sortOption(req)),
    Product.countDocuments(find),
  ]);

  const totalPages = Math.ceil(total / limit);

  // Giảm giá
  const newProducts = products.map((product) => {
    product.priceNew = (
      (product.price * (100 - product.discountPercentage)) /
      100
    ).toFixed(0);
    return product;
  });

  res.render("client/pages/products/index", {
    title: "Products",
    products: newProducts,
    keyword,
    sort,
    totalPages,
    page,
    brand: selectBrand,
  });
};

// [GET] /products/:slug
module.exports.getDetail = async (req, res) => {
  const slug = req.params.slug;
  let find = {
    deleted: false,
    status: "active",
  };
  find.slug = slug;
  const item = await Product.findOne(find);

  // relatedProducts
  const relatedProducts = await Product.find({
    deleted: false,
    status: "active",
    brand: item.brand,
  }).limit(4);
  // console.log(relatedProducts);

  res.render("client/pages/products/detail", {
    title: item.title,
    product: item,
    relatedProducts,
  });
};

// [GET] /products/:slug/buy
module.exports.getBuy = async (req, res) => {
  console.log(req.params.slug);
  const slug = req.params.slug;
  // res.send("OK");
  res.render("client/pages/products/buy", {
    slug,
  });
};

// [POST] /products/:slug/buy
module.exports.postBuy = async (req, res) => {
  console.log(req.body);
  const { slug, name, address, phone, quantity } = req.body;
  // Tạo đơn hàng
  const order = new Order({
    items: [
      {
        slug: slug,
        quantity: Number(quantity),
      },
    ],
    name,
    address,
    phone,
  });
  await order.save();
  res.send("Đặt hàng thành công");
};

// [POST] /products/:slug/add-to-cart
module.exports.postAddToCart = async (req, res) => {
  // console.log(req.params.slug);
  const { slug, quantity, title } = req.body;

  if (!req.session.cart) {
    req.session.cart = []; // Tạo giỏ hàng nếu chưa có
  }

  // Kiểm tra sản phẩm đã có chưa
  const existing = req.session.cart.find((item) => item.slug === slug);

  if (existing) {
    existing.quantity = Number(existing.quantity) + Number(quantity);
  } else {
    req.session.cart.push({ slug, quantity, title });
  }

  res.json({ message: "Đã thêm vào giỏ", cart: req.session.cart });
};
