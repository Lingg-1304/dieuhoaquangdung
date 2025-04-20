//model product
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String, // Email of the user
  password: String, // Password of the user
  name: String, // Name of the user
});

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
