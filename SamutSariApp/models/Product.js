const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String, default: "No description available" },
  stock: { type: Number, default: 100 },
  isService: { type: Boolean, default: false }, // true for services, false for products
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", productSchema);
