
require("dotenv").config();

console.log("[BOOT] server.js loaded");

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  console.log("[BOOT] startServer() called");

  try {
    console.log("[BOOT] Calling connectDB()");
    await connectDB();
    console.log("[BOOT] connectDB() completed");

    app.listen(PORT, () => {
      console.log(`[BOOT] Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("[BOOT] Startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
