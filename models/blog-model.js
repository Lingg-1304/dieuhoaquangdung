//model product
const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const blogSchema = new mongoose.Schema(
  {
    title: String,
    slug: {
      type: String,
      slug: "title",
      unique: true,
    },
    content: String,
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

const Blog = mongoose.model("Blog", blogSchema, "blogs");

module.exports = Blog;
