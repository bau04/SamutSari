const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Middleware to protect routes
function isLoggedIn(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect("/login");
}

// Guest routes
router.get("/shop", productController.getShop);
router.get("/services", productController.getServices);

// Logged-in routes
router.get("/homepage", isLoggedIn, productController.getLoggedHome);
router.get("/loggedShop", isLoggedIn, productController.getLoggedShop);
router.get("/loggedServices", isLoggedIn, productController.getLoggedServices);
router.get("/shopDetail/:id", isLoggedIn, productController.getShopDetail);
router.get("/serviceDetail/:id", isLoggedIn, productController.getServiceDetail);

module.exports = router;
