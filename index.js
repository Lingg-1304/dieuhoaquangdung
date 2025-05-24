require("dotenv").config();

const express = require("express");
const route = require("./routes/client/index-route.js");
const routeAdmin = require("./routes/admin/index-route.js");

const connectDB = require("./config/database.js");
const systemConfig = require("./config/system.js");

const methodOverride = require("method-override");

const sessionMiddleware = require("./models/session-model.js");

// req.flash()
const flash = require("express-flash");
const cookieParser = require("cookie-parser");

const app = express();
const Port = process.env.PORT;

// Connect to MongoDB
connectDB.connect();

// prefixAdmin
app.locals.prefixAdmin = systemConfig.prefixAdmin;
// console.log(app.locals.prefixAdmin);

app.set("view engine", "pug");
app.set("views", `${__dirname}/views`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(`${__dirname}/public`));
app.use(methodOverride("_method"));

// Parse cookies
app.use(cookieParser("linhdeptrai"));

// Cấu hình session
app.use(sessionMiddleware);

// Flash
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

route(app);
routeAdmin(app);

app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});
