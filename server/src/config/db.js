const mongoose = require("mongoose");
const connectDB = async () => {
  console.log(
    "Starting MongoDB connection; URI configured:",
    Boolean(process.env.MONGODB_URI),
  );

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

module.exports = connectDB;
