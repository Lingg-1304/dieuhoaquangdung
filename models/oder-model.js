const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  items: [
    {
      slug: String,
      quantity: Number,
    },
  ],
  name: String,
  address: String,
  phone: String,
  status: {
    type: String,
    default: "inactive",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
