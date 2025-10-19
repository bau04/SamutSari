const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    const cart = await Cart.findOne({ userId: req.session.user._id }).populate("items.productId");
    const cartItems = cart ? cart.items : [];
    const totalPrice = cart ? cart.totalPrice : 0;

    res.render("cart", { cartItems, totalPrice, user: req.session.user });
  } catch (error) {
    console.error("Get cart error:", error);
    res.redirect("/homepage");
  }
};

// Add to cart
exports.addToCart = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    const { productId, name, price, image, category } = req.body;
    
    let cart = await Cart.findOne({ userId: req.session.user._id });

    if (!cart) {
      cart = new Cart({ userId: req.session.user._id, items: [] });
    }

    // Check if item already exists
    const existingItem = cart.items.find(item => item.productId.toString() === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        productId,
        name,
        price: parseFloat(price),
        quantity: 1,
        image,
        category
      });
    }

    await cart.save();
    res.redirect("/cart");
  } catch (error) {
    console.error("Add to cart error:", error);
    res.redirect("/loggedShop");
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { itemId, action } = req.body;
    const cart = await Cart.findOne({ userId: req.session.user._id });

    if (cart) {
      const item = cart.items.id(itemId);
      if (item) {
        if (action === "increase") {
          item.quantity += 1;
        } else if (action === "decrease" && item.quantity > 1) {
          item.quantity -= 1;
        }
        await cart.save();
      }
    }

    res.redirect("/cart");
  } catch (error) {
    console.error("Update cart error:", error);
    res.redirect("/cart");
  }
};

// Remove from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.body;
    const cart = await Cart.findOne({ userId: req.session.user._id });

    if (cart) {
      cart.items = cart.items.filter(item => item._id.toString() !== itemId);
      await cart.save();
    }

    res.redirect("/cart");
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.redirect("/cart");
  }
};

// Checkout page
exports.getCheckout = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    const cart = await Cart.findOne({ userId: req.session.user._id });
    if (!cart || cart.items.length === 0) {
      return res.redirect("/cart");
    }

    res.render("checkout", {
      cartItems: cart.items,
      totalPrice: cart.totalPrice,
      user: req.session.user
    });
  } catch (error) {
    console.error("Checkout error:", error);
    res.redirect("/cart");
  }
};

// Process checkout
exports.processCheckout = async (req, res) => {
  try {
    const Order = require("../models/Order");
    const cart = await Cart.findOne({ userId: req.session.user._id });

    if (!cart || cart.items.length === 0) {
      return res.redirect("/cart");
    }

    const order = new Order({
      userId: req.session.user._id,
      items: cart.items,
      totalPrice: cart.totalPrice,
      shippingAddress: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        mobile: req.body.mobile,
        address1: req.body.address1,
        address2: req.body.address2,
        country: req.body.country,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip
      },
      paymentMethod: req.body.payment
    });

    await order.save();
    
    // Clear cart
    cart.items = [];
    await cart.save();

    res.redirect("/homepage");
  } catch (error) {
    console.error("Process checkout error:", error);
    res.redirect("/checkout");
  }
};
