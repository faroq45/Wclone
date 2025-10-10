const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const User = require("./models/User");
const Message = require("./models/Message");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 9300;

// MongoDB connect
mongoose.connect("mongodb://127.0.0.1:27017/chatApp");

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "chat_secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.static(path.join(__dirname, "public")));

// Auth middleware
function isAuth(req, res, next) {
  if (req.session.userId) next();
  else res.redirect("/login");
}

// Routes
app.get("/", (req, res) => {
  if (!req.session.userId) return res.redirect("/login");
  res.redirect("/chat");
});

// Signup
app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    await User.create({ username, password: hash });
    res.redirect("/login");
  } catch (e) {
    res.send("User already exists");
  }
});

// Login
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user._id;
    req.session.username = user.username;
    res.redirect("/chat");
  } else {
    res.send("Invalid login");
  }
});

// Chat page
app.get("/chat", isAuth, async (req, res) => {
  const messages = await Message.find().sort({ createdAt: 1 });
  res.render("chat", { username: req.session.username, messages });
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

// ---------------------------
// Socket.IO
// ---------------------------
let onlineUsers = {}; // { socket.id: username }

io.on("connection", (socket) => {
  console.log("A user connected");

  // Add new user
  socket.on("new user", (username) => {
    onlineUsers[socket.id] = username;
    io.emit("updateUsers", Object.values(onlineUsers));
  });

  // Handle chat messages
  socket.on("chat message", async (msg) => {
    const newMsg = new Message({
      sender: msg.sender,
      text: msg.text,
    });
    await newMsg.save();

    // Private message
    if (msg.recipient) {
      const recipientSocket = Object.keys(onlineUsers).find(
        id => onlineUsers[id] === msg.recipient
      );

      // Send to recipient (if online)
      if (recipientSocket) {
        io.to(recipientSocket).emit("chat message", {
          sender: msg.sender,
          text: msg.text,
          recipient: msg.recipient,
          createdAt: newMsg.createdAt
        });
      }

      // Send back to sender
      socket.emit("chat message", {
        sender: msg.sender,
        text: msg.text,
        recipient: msg.recipient,
        createdAt: newMsg.createdAt
      });
    } else {
      // Public message
      io.emit("chat message", {
        sender: msg.sender,
        text: msg.text,
        createdAt: newMsg.createdAt
      });
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected");
    delete onlineUsers[socket.id];
    io.emit("updateUsers", Object.values(onlineUsers));
  });
});

// Start server
server.listen(PORT, () =>
  console.log("Server running on http://localhost:" + PORT)
);
