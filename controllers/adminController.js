const Admin = require("../models/Admin");
const User = require("../models/User");
const Seller = require("../models/Seller");
const bcrypt = require("bcryptjs");

// Admin Login Page
exports.getAdminLogin = (req, res) => {
  res.render("adminLogin", { message: null });
};

// Admin Login Submit
exports.postAdminLogin = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.render("adminLogin", {
        message: "No admin account found with that email address.",
      });
    }

    const match = await bcrypt.compare(password, admin.password);

    if (match) {
      req.session.admin = admin;
      return res.redirect("/admin/dashboard");
    } else {
      return res.render("adminLogin", {
        message: "Incorrect password. Please try again.",
      });
    }
  } catch (error) {
    console.error("Admin login error:", error);
    return res.render("adminLogin", {
      message: "An error occurred during login. Please try again.",
    });
  }
};

// Admin Dashboard
exports.getAdminDashboard = async (req, res) => {
  try {
    if (!req.session.admin) {
      return res.redirect("/admin/login");
    }

    const users = await User.find().sort({ _id: -1 });
    const sellers = await Seller.find().sort({ createdAt: -1 });
    
    res.render("adminDashboard", { admin: req.session.admin, users, sellers });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.redirect("/admin/login");
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    await User.findByIdAndDelete(userId);
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Delete user error:", error);
    res.redirect("/admin/dashboard");
  }
};

// Delete Seller
exports.deleteSeller = async (req, res) => {
  try {
    const { sellerId } = req.body;
    await Seller.findByIdAndDelete(sellerId);
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Delete seller error:", error);
    res.redirect("/admin/dashboard");
  }
};

// Admin Logout
exports.adminLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
