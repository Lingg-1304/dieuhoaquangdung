const Order = require("../../models/order-model"); // Mongoose schema
const Product = require("../../models/product-model");

// GET: /cart
module.exports.index = async (req, res) => {
  const myCart = req.session.cart;

  let products = [];
  for (let item of myCart) {
    // console.log(item);
    let product = await Product.findOne({ slug: item.slug });
    products.push(product);
  }

  res.render("client/pages/cart/index", {
    title: "Giỏ hàng",
    products,
  });
};

// GET: /cart/order
module.exports.order = async (req, res) => {
  const userId = req.session.userId;
  const myOrder = await Order.find({ userId, status: { $ne: "Đã hủy" } }).sort({
    createdAt: -1,
  });

  for (let order of myOrder) {
    // Lấy thông tin sản phẩm cho từng đơn hàng
    for (let item of order.items) {
      const product = await Product.findOne({ slug: item.slug });
      if (product) {
        item.product = product; // Thêm thông tin sản phẩm vào từng mục
      }
      // console.log(item.product);
    }
  }
  res.render("client/pages/cart/order", {
    title: "Đơn hàng của bạn",
    order: myOrder,
  });
};

// POST: /cart/order/edit
module.exports.editOrder = async (req, res) => {
  // console.log(req.body);
  const orderId = req.body.orderId;
  const userId = req.session.userId;
  try {
    // 1. Tìm đơn hàng
    const order = await Order.findOne({ userId, orderId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng để chỉnh sửa.",
      });
    }
    // 2. Cập nhật thông tin đơn hàng
    order.name = req.body.name || order.name;
    order.email = req.body.email || order.email;
    order.address = req.body.address || order.address;
    order.phone = req.body.phone || order.phone;
    order.note = req.body.note || order.note;

    // 3. Lưu lại đơn hàng đã chỉnh sửa
    await order.save();
    return res.json({
      success: true,
      message: "Cập nhật đơn hàng thành công.",
    });
  } catch (err) {
    console.error("Lỗi khi cập nhật đơn hàng:", err);
    return res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra. Không thể cập nhật đơn hàng.",
    });
  }
};

// POST: /cart/order/remove
module.exports.removeOrder = async (req, res) => {
  const orderId = req.body.orderId;
  const userId = req.session.userId;
  console.log(orderId);

  try {
    // 1. Tìm đơn hàng
    const order = await Order.findOne({ userId, orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng để xoá.",
      });
    }

    // 2. Thay đổi trạng thái đơn hàng thành đã xoá
    order.status = "Đã hủy"; // Hoặc bất kỳ trạng thái nào bạn muốn
    // 3. Lưu lại đơn hàng đã chỉnh sửa
    await order.save();

    return res.json({
      success: true,
      message: "Xoá đơn hàng thành công.",
    });
  } catch (err) {
    console.error("Lỗi khi xoá đơn hàng:", err);
    return res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra. Không thể xoá đơn hàng.",
    });
  }
};

// POST: /cart/buy
module.exports.buy = async (req, res) => {
  const userId = req.session.userId;
  console.log(req.body);

  res.status(200).json({
    success: true,
    message: "Đặt hàng thành công.",
  });
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
