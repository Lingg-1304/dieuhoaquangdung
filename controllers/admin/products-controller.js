const Product = require("../../models/product-model");
const sharp = require("sharp");
const path = require("path");

const systemConfig = require("../../config/system");

// [GET] --> /admin/products
module.exports.index = async (req, res) => {
  let keyword = req.query.keyword;
  let status = req.query.status;
  let brand = req.query.brand;
  let find = {
    deleted: false,
  };

  if (brand) {
    find.brand = brand;
  }

  let sortOption, sort;
  switch (req.query.sort) {
    case "price_asc":
      sortOption = { price: 1 };
      sort = "1";
      break;
    case "price_desc":
      sortOption = { price: -1 };
      sort = "2";
      break;
    case "":
      sortOption = { position: -1 }; // hoặc trường viewCount nếu có
      break;
  }

  // Phân trang ?page=
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;

  if (req.query.status) find.status = req.query.status;
  if (req.query.keyword) {
    find.title = { $regex: req.query.keyword, $options: "i" };
  }

  const [products, total] = await Promise.all([
    Product.find(find).skip(skip).limit(limit).sort(sortOption),
    Product.countDocuments(find),
  ]);

  const totalPages = Math.ceil(total / limit);
  // console.log(products);
  res.render(`admin/pages/products/index`, {
    title: "Admin products",
    sort,
    brand,
    products,
    currentPath: req.path,
    keyword,
    status,
    totalPages,
    currentPage: page,
  });
};

// [CREATE] --> /admin/products/create
module.exports.createGet = async (req, res) => {
  res.render(`admin/pages/products/create`, {
    title: "Thêm sản phẩm",
    currentPath: req.path,
  });
};
module.exports.createPost = async (req, res) => {
  try {
    const filename = `product_${Date.now()}.jpg`;
    const filepath = path.join(__dirname, "../../public/uploads", filename);

    // Crop ảnh trước khi lưu
    if (req.file) {
      await sharp(req.file.buffer)
        .resize(400, 300, {
          fit: "contain", // Thay 'cover' bằng 'contain' để giữ nguyên tỷ lệ
          background: { r: 255, g: 255, b: 255, alpha: 1 }, // Thêm màu nền trắng (hoặc màu khác tùy chọn)
        })
        .toFile(filepath);
    }

    const products = await Product.find({ deleted: false });

    const product = {
      ...req.body,
      thumbnail: req.file ? `/uploads/${filename}` : "/uploads/default.jpg",
      newPrice: Math.round(
        (req.body.price * (100 - req.body.discountPercentage)) / 100
      ),
      position: products.length,
      features: (req.body.features || "")
        .split("\n")
        .map((f) => f.trim())
        .filter((f) => f),
    };

    await new Product(product).save();
    req.flash("success", "Thêm sản phẩm thành công");
    res.redirect("/admin/products/create");
  } catch (err) {
    console.error(err);
    req.flash("error", "Có lỗi xảy ra");
    res.redirect("/admin/products/create");
  }
};

// [POST] --> /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const { id, status } = req.params;
  const currentPage = req.body.currentPage;
  // console.log(currentPage);
  const item = await Product.findOne({ _id: id });
  try {
    await Product.findByIdAndUpdate(id, { status });
    req.flash(
      "success",
      `Thay đổi trạng thái sản phẩm "${item.title}" thành công`
    );

    res.redirect(
      `${systemConfig.prefixAdmin}/products?page=${currentPage || 1}`
    );
  } catch (err) {
    console.error("Lỗi cập nhật trạng thái:", err);
    res.redirect(
      `${systemConfig.prefixAdmin}/products?page=${currentPage || 1}`
    );
  }
};

// [EDIT] --> /admin/products/edit/:id
module.exports.editGet = async (req, res) => {
  const id = req.params.id;
  const product = await Product.findOne({ _id: id });
  product.features = product.features.join("\n");
  res.render(`admin/pages/products/edit`, {
    title: "Edit sản phẩm",
    product: product,
    currentPath: req.path,
  });
};
module.exports.editPost = async (req, res) => {
  const id = req.params.id;
  const item = req.body;
  if (req.file) {
    const filename = `product_${Date.now()}.jpg`;
    const filepath = path.join(__dirname, "../../public/uploads", filename);

    // Crop ảnh trước khi lưu
    await sharp(req.file.buffer)
      .resize(400, 300, {
        fit: "contain", // Thay 'cover' bằng 'contain' để giữ nguyên tỷ lệ
        background: { r: 255, g: 255, b: 255, alpha: 1 }, // Thêm màu nền trắng (hoặc màu khác tùy chọn)
      })
      .toFile(filepath);
    item.thumbnail = `/uploads/${filename}`;
  }
  item.newPrice = Math.round(
    (item.price * (100 - item.discountPercentage)) / 100
  );
  item.features = item.features
    .split("\n")
    .map((f) => f.trim())
    .filter((f) => f);
  // console.log(req.body);
  await Product.findByIdAndUpdate(id, item);
  req.flash("success", "Chỉnh sửa sản phẩm thành công");
  res.redirect(`${systemConfig.prefixAdmin}/products/edit/${id}`);
};

// [DELETE] --> /admin/products/delete/:id
module.exports.deleteProduct = async (req, res) => {
  const id = req.params.id;
  const item = await Product.findOne({ _id: id });
  const referer = req.get("Referer"); // Lấy URL của trang trước đó từ header Referer
  // console.log("Referer:", referer);
  try {
    await Product.findByIdAndUpdate(id, {
      deleted: true,
      deletedAt: new Date(),
    });
    req.flash("success", `Xóa sản phẩm "${item.title}" thành công`);
    res.redirect(referer);
  } catch (error) {
    console.error("Xoá thất bại:", error);
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};
