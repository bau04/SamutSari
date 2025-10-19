const Product = require("../models/Product");

// Home page - display products
exports.getHome = async (req, res) => {
  try {
    const products = await Product.find({ isService: false }).limit(8);
    res.render("index", { products });
  } catch (error) {
    console.error("Get home error:", error);
    res.render("index", { products: [] });
  }
};

// Logged-in homepage
exports.getLoggedHome = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }
    const products = await Product.find({ isService: false }).limit(8);
    res.render("homepage", { products, user: req.session.user });
  } catch (error) {
    console.error("Get logged home error:", error);
    res.render("homepage", { products: [], user: req.session.user });
  }
};

// Shop page (guest)
exports.getShop = async (req, res) => {
  try {
    const products = await Product.find({ isService: false });
    res.render("shop", { products });
  } catch (error) {
    console.error("Get shop error:", error);
    res.render("shop", { products: [] });
  }
};

// Shop page (logged in)
exports.getLoggedShop = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }
    const products = await Product.find({ isService: false });
    res.render("loggedShop", { products, user: req.session.user });
  } catch (error) {
    console.error("Get logged shop error:", error);
    res.render("loggedShop", { products: [], user: req.session.user });
  }
};

// Services page (guest)
exports.getServices = async (req, res) => {
  try {
    const services = await Product.find({ isService: true });
    res.render("services", { services });
  } catch (error) {
    console.error("Get services error:", error);
    res.render("services", { services: [] });
  }
};

// Services page (logged in)
exports.getLoggedServices = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }
    const services = await Product.find({ isService: true });
    res.render("loggedServices", { services, user: req.session.user });
  } catch (error) {
    console.error("Get logged services error:", error);
    res.render("loggedServices", { services: [], user: req.session.user });
  }
};

// Product detail page
exports.getShopDetail = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.redirect("/loggedShop");
    }
    res.render("shopDetail", { product, user: req.session.user });
  } catch (error) {
    console.error("Get shop detail error:", error);
    res.redirect("/loggedShop");
  }
};

// Service detail page
exports.getServiceDetail = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }
    const service = await Product.findById(req.params.id);
    if (!service) {
      return res.redirect("/loggedServices");
    }
    res.render("serviceDetail", { service, user: req.session.user });
  } catch (error) {
    console.error("Get service detail error:", error);
    res.redirect("/loggedServices");
  }
};
