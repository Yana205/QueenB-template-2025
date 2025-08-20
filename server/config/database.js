const mongoose = require("mongoose");

// MongoDB Connection Configuration
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      console.log("✅ MongoDB Atlas connected successfully");
      
      // Connection event listeners
      mongoose.connection.on("error", (err) => {
        console.error("❌ MongoDB connection error:", err);
      });
      
      mongoose.connection.on("disconnected", () => {
        console.log("⚠️  MongoDB disconnected");
      });
      
      mongoose.connection.on("reconnected", () => {
        console.log("✅ MongoDB reconnected");
      });
      
    } else {
      console.log("⚠️  MONGODB_URI not set, using local data storage");
    }
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    console.log("⚠️  Continuing with local data storage");
  }
};

// Graceful shutdown
const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log("✅ MongoDB connection closed");
  } catch (error) {
    console.error("❌ Error closing MongoDB connection:", error);
  }
};

module.exports = { connectDB, closeDB };
