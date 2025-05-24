const dashboardRoute = require("./dashboard-route");
const productsRoute = require("./products-route");
const orderRoute = require("./order-route");
const blogsRoute = require("./blogs-route");
const settingRoute = require("./setting-route");
const systemConfig = require("../../config/system");

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;

  app.use(PATH_ADMIN + "/dashboard", dashboardRoute); // Admin dashboard route
  app.use(PATH_ADMIN + "/products", productsRoute);
  app.use(PATH_ADMIN + "/order", orderRoute);
  app.use(PATH_ADMIN + "/blogs", blogsRoute);
  app.use(PATH_ADMIN + "/setting", settingRoute);
};
