const express = require("express");
const router = express.Router();
const sellerController = require("../controllers/sellerController");

// Seller login
router.get("/seller/login", sellerController.getSellerLogin);
router.post("/seller/login", sellerController.postSellerLogin);

// Seller dashboard
router.get("/seller/dashboard", sellerController.getSellerDashboard);

// Update order status
router.post("/seller/update-order", sellerController.updateOrderStatus);

// Seller logout
router.get("/seller/logout", sellerController.sellerLogout);

module.exports = router;
