const mongoose = require("mongoose");

/**
 * Message Model
 * Stores chat messages with timestamps
 */
const messageSchema = new mongoose.Schema(
  {
    sender: { 
      type: String, 
      required: true,
      trim: true,
    },
    text: { 
      type: String, 
      required: true,
      maxlength: 1000,
    },
    // Room support for future multi-room feature
    room: {
      type: String,
      default: "general",
    },
  },
  { 
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

// Index for faster message retrieval
messageSchema.index({ createdAt: -1 });
messageSchema.index({ room: 1, createdAt: -1 });

module.exports = mongoose.model("Message", messageSchema);
