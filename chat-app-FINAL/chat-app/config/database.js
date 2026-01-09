const mongoose = require("mongoose");

/**
 * Database connection configuration
 * Connects to MongoDB Atlas in production using MONGO_URI environment variable
 * Fails fast if MONGO_URI is not configured in production
 */
const connectDB = async () => {
  try {
    // Validate that MONGO_URI is set in production
    if (!process.env.MONGO_URI) {
      throw new Error(
        "FATAL: MONGO_URI environment variable is not defined. " +
        "Please configure MONGO_URI in your deployment environment."
      );
    }

    // Connect to MongoDB using environment variable
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    console.error("Exiting application due to database connection failure...");
    process.exit(1);
  }
};

module.exports = connectDB;
