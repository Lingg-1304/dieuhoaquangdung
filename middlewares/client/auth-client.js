// middlewares/client/auth-client.js

module.exports = (req, res, next) => {
  req.session.isAuth = true;
  // Nếu chưa có giỏ hàng trong session, thì tạo mảng rỗng
  if (!req.session.cart) {
    req.session.cart = [];
  }

  if (!req.session.order) {
    req.session.order = [];
  }

  // Bạn cũng có thể gán thêm user tạm (nếu cần phân biệt người dùng ẩn danh)
  if (!req.session.userId) {
    req.session.userId =
      Date.now() + "_" + Math.random().toString(36).substring(2, 10);
  }

  next(); // Cho phép đi tiếp các route
};
