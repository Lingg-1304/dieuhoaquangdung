const Order = require("../../models/oder-model"); // Mongoose schema
const Product = require("../../models/product-model");
// GET: /cart
module.exports.index = async (req, res) => {
  const cart = req.session.cart;
  let products = [];
  for (let item of cart) {
    // console.log(item);
    let product = await Product.findOne({ slug: item.slug });
    products.push(product);
  }

  console.log(products);

  res.render("client/pages/cart/index", {
    title: "Giỏ hàng",
    cart: products,
  });
};

// GET: /cart/order
module.exports.order = async (req, res) => {
  res.json({ cart: req.session.cart || [] });
};

module.exports.buy = async (req, res) => {
  const {
    selectedItems = [],
    quantities = {},
    titles = {},
    customerName,
    customerPhone,
    customerAddress,
  } = req.body;

  if (!selectedItems || !customerName || !customerPhone || !customerAddress) {
    return res.send("Thiếu thông tin mua hàng.");
  }

  const selected = Array.isArray(selectedItems)
    ? selectedItems
    : [selectedItems];

  const orders = selected.map((id) => ({
    slug: id,
    quantity: Number(quantities[id]) || 1,
  }));

  const shippingInfo = {
    name: customerName,
    phone: customerPhone,
    address: customerAddress,
  };

  console.log("Đơn hàng:", orders);
  console.log("Thông tin giao hàng:", shippingInfo);

  const order = new Order({
    items: orders,
    name: customerName,
    phone: customerPhone,
    address: customerAddress,
  });
  await order.save();

  // Tiếp theo: lưu vào DB hoặc xử lý thanh toán
  res.send("Đặt hàng thành công!");
};

// POST: /cart/remove/:slug
module.exports.remove = async (req, res) => {
  const slug = req.params.slug;
  const cart = req.session.cart || [];

  // Tìm và xóa sản phẩm có slug tương ứng trong giỏ hàng
  const index = cart.findIndex((item) => item.slug === slug);
  if (index !== -1) {
    cart.splice(index, 1); // Xóa sản phẩm khỏi giỏ hàng
    req.session.cart = cart; // Cập nhật lại session
    return res.json({ success: true });
  }

  return res.json({ success: false });
};
