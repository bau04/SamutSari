const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// login
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);

// signup/register
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);
router.get("/register", authController.getSignup);
router.post("/register", authController.postSignup);

// Change Password 
router.get("/forgot-password", authController.getForgotPassword);
router.post("/forgot-password", authController.postForgotPassword);
router.post("/forgot-password/change", authController.postChangePassword);

// Profile
router.get("/profile", authController.getProfile);
router.post("/profile/update", authController.updateProfile);

// logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
