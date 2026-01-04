const express = require("express");
const router = express.Router();
const { getSignup, postSignup, getLogin, postLogin, logout } = require("../controllers/authController");
const { redirectIfAuth } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimiter");

// Signup routes
router.get("/signup", redirectIfAuth, getSignup);
router.post("/signup", authLimiter, postSignup);

// Login routes
router.get("/login", redirectIfAuth, getLogin);
router.post("/login", authLimiter, postLogin);

// Logout route
router.get("/logout", logout);

module.exports = router;
