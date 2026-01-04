const mongoose = require("mongoose");

/**
 * User Model
 * Stores user authentication information
 */
const userSchema = new mongoose.Schema(
  {
    username: { 
      type: String, 
      unique: true, 
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    password: { 
      type: String, 
      required: true 
    },
    // Additional fields for future enhancements
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster username lookups
userSchema.index({ username: 1 });

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
