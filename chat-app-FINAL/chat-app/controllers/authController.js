const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { sanitizeInput, isValidUsername, isValidPassword } = require("../utils/sanitizer");

/**
 * Render signup page
 */
const getSignup = (req, res) => {
  res.render("signup", { error: null });
};

/**
 * Handle user registration
 */
const postSignup = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate username
    if (!isValidUsername(username)) {
      return res.render("signup", { 
        error: "Username must be 3-20 characters (letters, numbers, underscore, hyphen)" 
      });
    }
    
    // Validate password
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.isValid) {
      return res.render("signup", { error: passwordValidation.message });
    }
    
    // Sanitize username (prevent XSS)
    const cleanUsername = sanitizeInput(username);
    
    // Check if user exists
    const existingUser = await User.findOne({ username: cleanUsername });
    if (existingUser) {
      return res.render("signup", { error: "Username already taken" });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    await User.create({ 
      username: cleanUsername, 
      password: hashedPassword 
    });
    
    // Redirect to login with success message
    res.redirect("/login?registered=true");
  } catch (error) {
    console.error("Signup error:", error);
    res.render("signup", { error: "Registration failed. Please try again." });
  }
};

/**
 * Render login page
 */
const getLogin = (req, res) => {
  const registered = req.query.registered === "true";
  res.render("login", { 
    error: null, 
    success: registered ? "Registration successful! Please login." : null 
  });
};

/**
 * Handle user login
 */
const postLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Basic validation
    if (!username || !password) {
      return res.render("login", { 
        error: "Please provide username and password",
        success: null 
      });
    }
    
    // Sanitize input
    const cleanUsername = sanitizeInput(username);
    
    // Find user
    const user = await User.findOne({ username: cleanUsername });
    
    if (!user) {
      return res.render("login", { 
        error: "Invalid username or password",
        success: null 
      });
    }
    
    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.render("login", { 
        error: "Invalid username or password",
        success: null 
      });
    }
    
    // Set session
    req.session.userId = user._id;
    req.session.username = user.username;
    
    // Redirect to chat
    res.redirect("/chat");
  } catch (error) {
    console.error("Login error:", error);
    res.render("login", { 
      error: "Login failed. Please try again.",
      success: null 
    });
  }
};

/**
 * Handle user logout
 */
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.redirect("/chat");
    }
    res.clearCookie("connect.sid"); // Clear session cookie
    res.redirect("/login");
  });
};

module.exports = {
  getSignup,
  postSignup,
  getLogin,
  postLogin,
  logout,
};
