const Product = require("../../models/product-model");
const Order = require("../../models/order-model"); // Mongoose schema
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

// [POST] /products/:slug
module.exports.postDetail = async (req, res) => {
  // console.log(req.url);
  if (req.query.action === "add-to-cart") {
    const { slug } = req.body;

    if (!req.session.cart) {
      req.session.cart = []; // Tạo giỏ hàng nếu chưa có
    }

    // Kiểm tra sản phẩm đã có chưa
    const existing = req.session.cart.find((item) => item.slug === slug);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Sản phẩm đã có trong giỏ hàng",
      });
    }
    req.session.cart.push({ slug });
    return res.json({ success: true });
  }
  if (req.query.action === "buy") {
    const {
      slug,
      quantity,
      customerName,
      customerPhone,
      customerAddress,
      customerNote,
      customerEmail,
      paymentMethod,
      orderCode,
      subtotal,
    } = req.body;
    // xử lý logic mua hàng

    const userId = req.session.userId;
    const myOrder = new Order({
      orderId: orderCode,
      userId,
      items: [{ slug, quantity }],
      name: customerName,
      email: customerEmail,
      address: customerAddress,
      phone: customerPhone,
      note: customerNote,
      paymentMethod: paymentMethod,
      totalPrice: subtotal,
    });

    console.log(myOrder);

    await myOrder.save();

    return res.status(200).json({
      success: true,
    });
  }
};
