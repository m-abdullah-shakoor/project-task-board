const mongoose = require("mongoose");

let connectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (!connectionPromise) {
    console.log("[DB] Starting MongoDB connection");

    connectionPromise = mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => {
        console.log("[DB] MongoDB connected successfully");
        return mongoose.connection;
      })
      .catch((error) => {
        connectionPromise = null;
        console.error("[DB] MongoDB connection failed:", error.message);
        throw error;
      });
  }

  return connectionPromise;
};

module.exports = connectDB;
