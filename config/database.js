const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
module.exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};
