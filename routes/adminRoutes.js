const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Admin login
router.get("/admin/login", adminController.getAdminLogin);
router.post("/admin/login", adminController.postAdminLogin);

// Admin dashboard
router.get("/admin/dashboard", adminController.getAdminDashboard);

// Delete user/seller
router.post("/admin/delete-user", adminController.deleteUser);
router.post("/admin/delete-seller", adminController.deleteSeller);

// Admin logout
router.get("/admin/logout", adminController.adminLogout);

module.exports = router;
