const Order = require("../../models/oder-model"); // Mongoose schema

module.exports.index = async (req, res) => {
  const cart = req.session.cart;
  // console.log(cart);
  res.render("client/pages/cart/index", {
    title: "Giỏ hàng",
    cart,
  });
};

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
