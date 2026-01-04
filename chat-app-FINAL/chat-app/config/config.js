require("dotenv").config();

/**
 * Centralized configuration for the application
 * All environment variables and app settings
 */
module.exports = {
  port: process.env.PORT || 9200,
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/chatApp",
  sessionSecret: process.env.SESSION_SECRET || "default_secret_change_in_production",
  nodeEnv: process.env.NODE_ENV || "development",
  
  // Session configuration
  session: {
    secret: process.env.SESSION_SECRET || "default_secret_change_in_production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // Prevents client-side JS access to cookies
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "lax", // CSRF protection
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  },
  
  // Rate limiting configuration
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
  },
  
  // Auth rate limiting (stricter)
  authRateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login/signup attempts per windowMs
  },
};
