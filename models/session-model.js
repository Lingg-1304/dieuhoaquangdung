const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);

// Tạo store + middleware rồi export ra
module.exports = session({
  secret: "linhdeptrai",
  store: new MongoDBSession({
    uri: process.env.MONGODB_URL,
    collection: "my-session",
  }),
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 },
});
