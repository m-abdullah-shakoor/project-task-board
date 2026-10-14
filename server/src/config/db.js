const mongoose = require("mongoose");

const connectDB = async () => {
  console.log("[DB] connectDB() entered");
  console.log("[DB] MONGODB_URI configured:", Boolean(process.env.MONGODB_URI));

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("[DB] MongoDB connected successfully");
  } catch (error) {
    console.error("[DB] Connection failed:", error.message);
    throw error;
  }
};

module.exports = connectDB;