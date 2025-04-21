//model product
const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
  {
    title: String,
    brand: String,
    features: {
      type: [String],
      required: true,
    }, // Tính năng nổi bật
    warranty: String, // bảo hành
    slug: {
      type: String,
      slug: "title",
      unique: true,
    },
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: {
      type: String,
      default: "active",
    },
    position: Number,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;
