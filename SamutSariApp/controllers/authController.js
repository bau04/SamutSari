const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Login Page
exports.getLogin = (req, res) => {
  res.render("login", { message: null });
};

// Login Submit
exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.render("login", {
        message: "No account found with that email address.",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      req.session.user = user;
      return res.redirect("/homepage");
    } else {
      return res.render("login", {
        message: "Incorrect password. Please try again.",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.render("login", {
      message: "An error occurred during login. Please try again.",
    });
  }
};

// Signup
exports.getSignup = (req, res) => {
  res.render("signup", { message: null });
};

exports.postSignup = async (req, res) => {
  const { username, firstName, lastName, email, contact, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("signup", {
        message: "Email already registered. Please log in instead.",
      });
    }

    const newUser = new User({
      username,
      firstName,
      lastName,
      email,
      contact,
      password,
    });

    await newUser.save();
    res.redirect("/login");
  } catch (error) {
    console.error("Signup error:", error);
    return res.render("signup", {
      message: "An error occurred during registration. Please try again.",
    });
  }
};

// Forgot Password
exports.getForgotPassword = (req, res) => {
  res.render("forgotPassword", { emailVerified: false, email: null, message: null });
};

exports.postForgotPassword = async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.render("forgotPassword", {
        emailVerified: false,
        email: null,
        message: "No account found with that email address.",
      });
    }

    res.render("forgotPassword", { emailVerified: true, email, message: null });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.render("forgotPassword", {
      emailVerified: false,
      email: null,
      message: "An error occurred. Please try again.",
    });
  }
};

// Change Password
exports.postChangePassword = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.render("forgotPassword", {
        emailVerified: false,
        email: null,
        message: "No account found with that email address.",
      });
    }

    user.password = password;
    await user.save();

    res.render("login", {
      message: "Password changed successfully! You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return res.render("forgotPassword", {
      emailVerified: true,
      email,
      message: "An error occurred while changing password. Please try again.",
    });
  }
};

// Profile Page
exports.getProfile = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }
    const user = await User.findById(req.session.user._id);
    res.render("profile", { user, message: null });
  } catch (error) {
    console.error("Get profile error:", error);
    res.redirect("/homepage");
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { username, firstName, lastName, email, contact } = req.body;
    const user = await User.findById(req.session.user._id);

    user.username = username;
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.contact = contact;

    await user.save();
    req.session.user = user;

    res.render("profile", { user, message: "Profile updated successfully!" });
  } catch (error) {
    console.error("Update profile error:", error);
    const user = await User.findById(req.session.user._id);
    res.render("profile", { user, message: "Error updating profile. Please try again." });
  }
};
