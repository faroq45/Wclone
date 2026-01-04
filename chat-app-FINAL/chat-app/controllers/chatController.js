const Message = require("../models/Message");

/**
 * Render chat page with recent messages
 */
const getChatPage = async (req, res) => {
  try {
    // Load last 100 messages
    const messages = await Message.find()
      .sort({ createdAt: 1 })
      .limit(100)
      .lean();
    
    res.render("chat", { 
      username: req.session.username,
      messages 
    });
  } catch (error) {
    console.error("Error loading chat:", error);
    res.render("chat", { 
      username: req.session.username,
      messages: [] 
    });
  }
};

module.exports = {
  getChatPage,
};
