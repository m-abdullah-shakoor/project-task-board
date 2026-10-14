const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json({ limit: "10kb" }));

const ensureDB = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("[DB] Request blocked:", error.message);

    res.status(503).json({
      success: false,
      message: "Database temporarily unavailable",
    });
  }
};

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is Running",
  });
});

app.use("/api/auth", ensureDB, authRoutes);
app.use("/api/projects", ensureDB, projectRoutes);
app.use("/api", ensureDB, taskRoutes);

module.exports = app;
