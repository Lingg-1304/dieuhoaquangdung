// ----> /admin/blogs

// [GET] /admin/blogs
module.exports.index = async (req, res) => {
  const blogs = {};
  let status = req.query.status;
  res.render("admin/pages/blogs/index", {
    title: "Quản lý bài viết",
    status,
    currentPath: req.path,
    blogs,
  });
};

// [GET] /admin/blogs/create
module.exports.createGet = async (req, res) => {
  res.send("get create");
};
// [POST] /admin/blogs/create
module.exports.createPost = async (req, res) => {
  res.send("post create");
};
