const Product = require("../../models/product-model");

const systemConfig = require("../../config/system");

const searchHelpers = require("../../helpers/search");
const statusHelpers = require("../../helpers/filterStatus");

// [GET] --> /admin/products
module.exports.index = async (req, res) => {
  let keyword = req.query.keyword;
  let status = req.query.status;
  let find = {
    deleted: false,
  };

  // Phân trang ?page=
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;

  if (req.query.status) find.status = req.query.status;
  if (req.query.keyword) {
    find.title = { $regex: req.query.keyword, $options: "i" };
  }

  const [products, total] = await Promise.all([
    Product.find(find).skip(skip).limit(limit).sort({ position: -1 }),
    Product.countDocuments(find),
  ]);

  const totalPages = Math.ceil(total / limit);

  res.render(`admin/pages/products/index`, {
    title: "Admin products",
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
  const product = req.body;

  const products = await Product.find({ deleted: false });
  product.position = products.length;
  product.thumbnail = `/uploads/${req.file.filename}`;
  product.features = product.features
    .split("\n")
    .map((f) => f.trim())
    .filter((f) => f);
  // console.log(products.length);
  await new Product(product).save();
  req.flash("success", "Thêm sản phẩm thành công");
  res.redirect(`${systemConfig.prefixAdmin}/products/create`);
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
  const product = await Product.findOne({ _id: id });
  const item = req.body;
  item.thumbnail = req.file
    ? `/uploads/${req.file.filename}`
    : product.thumbnail;

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
