// middlewares/upload.js

const multer = require("multer");

const storage = multer.memoryStorage(); // Lưu file vào RAM để xử lý bằng sharp

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn dung lượng ảnh: 5MB
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Chỉ chấp nhận ảnh JPEG, PNG hoặc WEBP"));
    }
    cb(null, true);
  },
});

module.exports = upload;
