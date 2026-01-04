const Message = require("../models/Message");
const { sanitizeInput } = require("../utils/sanitizer");

// Store online users and their typing status
const onlineUsers = {};
const typingUsers = {};

/**
 * Initialize Socket.IO event handlers
 * @param {SocketIO.Server} io - Socket.IO server instance
 */
const initializeSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    
    // Handle new user joining
    socket.on("new user", (username) => {
      if (!username) return;
      
      const cleanUsername = sanitizeInput(username);
      onlineUsers[socket.id] = cleanUsername;
      
      // Broadcast updated user list to all clients
      io.emit("updateUsers", Object.values(onlineUsers));
      
      // Notify others that user joined
      socket.broadcast.emit("user joined", cleanUsername);
    });
    
    // Handle chat messages
    socket.on("chat message", async (msg) => {
      try {
        if (!msg || !msg.sender || !msg.text) return;
        
        // Sanitize message content to prevent XSS
        const cleanSender = sanitizeInput(msg.sender);
        const cleanText = sanitizeInput(msg.text);
        
        // Validate message length
        if (cleanText.length === 0 || cleanText.length > 1000) return;
        
        // Save message to database
        const newMsg = new Message({ 
          sender: cleanSender, 
          text: cleanText 
        });
        await newMsg.save();
        
        // Broadcast message to all clients
        io.emit("chat message", {
          sender: cleanSender,
          text: cleanText,
          createdAt: newMsg.createdAt,
        });
        
        // Clear typing indicator for this user
        if (typingUsers[socket.id]) {
          delete typingUsers[socket.id];
          io.emit("typing update", Object.values(typingUsers));
        }
      } catch (error) {
        console.error("Error handling message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });
    
    // Handle typing indicator
    socket.on("typing", (username) => {
      if (!username) return;
      
      const cleanUsername = sanitizeInput(username);
      typingUsers[socket.id] = cleanUsername;
      
      // Broadcast to all except sender
      socket.broadcast.emit("typing update", Object.values(typingUsers));
    });
    
    // Handle stop typing
    socket.on("stop typing", () => {
      if (typingUsers[socket.id]) {
        delete typingUsers[socket.id];
        socket.broadcast.emit("typing update", Object.values(typingUsers));
      }
    });
    
    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
      
      const username = onlineUsers[socket.id];
      
      // Remove from online users
      delete onlineUsers[socket.id];
      delete typingUsers[socket.id];
      
      // Broadcast updated lists
      io.emit("updateUsers", Object.values(onlineUsers));
      io.emit("typing update", Object.values(typingUsers));
      
      // Notify others that user left
      if (username) {
        socket.broadcast.emit("user left", username);
      }
    });
    
    // Handle errors
    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  });
};

module.exports = {
  initializeSocketHandlers,
};
