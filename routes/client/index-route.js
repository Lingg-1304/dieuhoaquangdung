const productRoute = require("./products-route");
const homeRoute = require("./home-route");
const cartRoute = require("./cart-route");
const authClient = require("../../middlewares/client/auth-client");
module.exports = (app) => {
  app.use("/", authClient, homeRoute);
  app.use("/products", authClient, productRoute);
  app.use("/cart", authClient, cartRoute);
};
