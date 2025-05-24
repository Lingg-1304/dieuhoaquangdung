const mongoose = require("mongoose");

// Đơn hàng của client
const orderSchema = new mongoose.Schema({
  userId: String,
  orderId: String,
  items: [
    {
      slug: String,
      quantity: Number,
    },
  ],
  paymentMethod: {
    type: String,
    default: "cod",
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  name: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
  note: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: "Chờ xác nhận",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
