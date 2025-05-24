const Order = require("../../models/order-model");
const systemConfig = require("../../config/system");

// [GET] --> /admin/order
module.exports.index = async (req, res) => {
  let find = {};

  if (req.query.keyword) {
    // Tìm kiếm theo mã đơn hàng hoặc tên khách hàng
    find = {
      $or: [
        { orderId: { $regex: req.query.keyword, $options: "i" } },
        { name: { $regex: req.query.keyword, $options: "i" } },
        { phone: { $regex: req.query.keyword, $options: "i" } },
      ],
    };
  }

  // Nếu có trạng thái đơn hàng, lọc theo trạng thái đó
  if (req.query.status) find.status = req.query.status;

  // Phân trang ?page=
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find(find).skip(skip).limit(limit).sort({ createdAt: 1 }),
    Order.countDocuments(find),
  ]);

  const totalPages = Math.ceil(total / limit);

  res.render("admin/pages/orders/index", {
    title: "Đơn hàng",
    orders,
    keyword: req.query.keyword || "",
    selectedStatus: req.query.status || "",
    currentPath: req.path,
    totalPages,
    currentPage: page,
  });
};

// [GET] --> /admin/order/:orderId
module.exports.detail = async (req, res) => {
  const orderId = req.params.orderId;
  const order = await Order.findOne({ orderId });
  res.render("admin/pages/orders/detail", {
    title: `Đơn hàng ${orderId}`,
    order,
    currentPath: req.path,
  });
};

// [POST] --> /admin/order/delete/:orderId
module.exports.delete = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const result = await Order.deleteOne({ orderId });
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng để xóa",
      });
    }
    res.status(200).json({
      success: true,
      message: "Xóa đơn hàng thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi xóa đơn hàng",
      error: error.message,
    });
  }
};

// [GET] --> /admin/order/edit/:orderId
module.exports.editGet = async (req, res) => {
  const orderId = req.params.orderId;
  const order = await Order.findOne({ orderId });
  res.render("admin/pages/orders/edit", {
    title: `Chỉnh sửa đơn hàng ${orderId}`,
    order,
    currentPath: req.path,
  });
};
// [POST] --> /admin/order/edit/:orderId
module.exports.editPost = async (req, res) => {
  const orderId = req.params.orderId;
  const { name, email, phone, address, note, paymentMethod, status } = req.body;

  await Order.updateOne(
    { orderId },
    {
      name,
      email,
      phone,
      address,
      note,
      paymentMethod,
      status,
    }
  );
  res.status(200).json({
    success: true,
    message: "Cập nhật đơn hàng thành công",
  });
};
