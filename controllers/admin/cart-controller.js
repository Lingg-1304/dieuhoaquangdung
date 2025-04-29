const Order = require("../../models/oder-model");
const systemConfig = require("../../config/system");

// [GET] --> /admin/cart
module.exports.index = async (req, res) => {
  let find = {};

  // Trạng thái ?status=
  let status = req.query.status;
  if (req.query.status) find.status = req.query.status;

  // Phân trang ?page=
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;
  const total = await Order.countDocuments(find);
  const totalPages = Math.ceil(total / limit);

  const orders = await Order.find(find)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  // console.log(orders);

  res.render(`admin/pages/cart/index`, {
    title: "Đơn hàng",
    currentPath: req.path,
    orders,
    totalPages,
    currentPage: page,
    status,
  });
};

// [POST] --> /admin/cart/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const { id, status } = req.params;
  const currentPage = req.body.currentPage;
  // console.log(currentPage);
  const item = await Order.findOne({ _id: id });
  try {
    await Order.findByIdAndUpdate(id, { status });
    req.flash("success", `Thay đổi trạng thái đơn hàng thành công`);

    res.redirect(`${systemConfig.prefixAdmin}/cart?page=${currentPage || 1}`);
  } catch (err) {
    console.error("Lỗi cập nhật trạng thái:", err);
    res.redirect(`${systemConfig.prefixAdmin}/cart?page=${currentPage || 1}`);
  }
};

// [POST] --> /admin/cart/detail/:id
module.exports.detail = async (req, res) => {
  res.send("chi tiết đơn hàng");
};
