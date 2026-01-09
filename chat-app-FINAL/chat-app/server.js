require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

// Import configurations
const config = require("./config/config");
const connectDB = require("./config/database");

// Import routes
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");

// Import socket handlers
const { initializeSocketHandlers } = require("./sockets/chatSocket");

// Import middleware
const { generalLimiter } = require("./middleware/rateLimiter");

// Initialize Express app
const app = express();

/**
 * ✅ REQUIRED FOR RENDER / PROXIES
 * Must be BEFORE rate-limit and sessions
 */
app.set("trust proxy", 1);

const server = http.createServer(app);
const io = new Server(server);

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session(config.session));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Apply rate limiting AFTER trust proxy
app.use(generalLimiter);

// Security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// Routes
app.use("/", authRoutes);
app.use("/", chatRoutes);

// Home route
app.get("/", (req, res) => {
  if (req.session.userId) {
    return res.redirect("/chat");
  }
  return res.redirect("/login");
});

// 404 handler
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).send("Internal server error");
});

// Initialize Socket.IO handlers
initializeSocketHandlers(io);

// Start server AFTER DB connection
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 9200;

    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down...");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});
