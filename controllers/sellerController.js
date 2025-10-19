const Seller = require("../models/Seller");
const Order = require("../models/Order");
const bcrypt = require("bcryptjs");

// Seller Login Page
exports.getSellerLogin = (req, res) => {
  res.render("sellerLogin", { message: null });
};

// Seller Login Submit
exports.postSellerLogin = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const seller = await Seller.findOne({ email });

    if (!seller) {
      return res.render("sellerLogin", {
        message: "No seller account found with that email address.",
      });
    }

    const match = await bcrypt.compare(password, seller.password);

    if (match) {
      req.session.seller = seller;
      return res.redirect("/seller/dashboard");
    } else {
      return res.render("sellerLogin", {
        message: "Incorrect password. Please try again.",
      });
    }
  } catch (error) {
    console.error("Seller login error:", error);
    return res.render("sellerLogin", {
      message: "An error occurred during login. Please try again.",
    });
  }
};

// Seller Dashboard
exports.getSellerDashboard = async (req, res) => {
  try {
    if (!req.session.seller) {
      return res.redirect("/seller/login");
    }

    const orders = await Order.find().populate("userId").sort({ createdAt: -1 });
    res.render("seller", { seller: req.session.seller, orders });
  } catch (error) {
    console.error("Seller dashboard error:", error);
    res.redirect("/seller/login");
  }
};

// Update Order Status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await Order.findByIdAndUpdate(orderId, { status });
    res.redirect("/seller/dashboard");
  } catch (error) {
    console.error("Update order status error:", error);
    res.redirect("/seller/dashboard");
  }
};

// Seller Logout
exports.sellerLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
