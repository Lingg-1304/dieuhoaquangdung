const multer = require("multer");

module.exports = () => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Đặt thư mục lưu trữ file upload
      cb(null, "./public/uploads/");
    },
    filename: function (req, file, cb) {
      // Đặt tên file với tiền tố thời gian để tránh trùng lặp
      const uniqueSuffix = Date.now();
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
  });

  return storage;
};
