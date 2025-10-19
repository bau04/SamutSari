const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  totalPrice: { type: Number, required: true },
  shippingAddress: {
    firstName: String,
    lastName: String,
    email: String,
    mobile: String,
    address1: String,
    address2: String,
    country: String,
    city: String,
    state: String,
    zip: String
  },
  paymentMethod: { type: String, required: true },
  status: { type: String, default: "Pending", enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
