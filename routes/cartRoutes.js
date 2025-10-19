const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

// Cart routes
router.get("/cart", cartController.getCart);
router.post("/cart/add", cartController.addToCart);
router.post("/cart/update", cartController.updateCartItem);
router.post("/cart/remove", cartController.removeFromCart);

// Checkout routes
router.get("/checkout", cartController.getCheckout);
router.post("/checkout/process", cartController.processCheckout);

module.exports = router;
