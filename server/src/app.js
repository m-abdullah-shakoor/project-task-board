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

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

// Controllers forward unexpected errors here so clients always get JSON.
app.use((error, req, res, next) => {
  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID.",
    });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: Object.values(error.errors)
        .map((item) => item.message)
        .join(" "),
    });
  }

  if (error.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON body.",
    });
  }

  console.error("Unhandled error:", error.message);

  return res.status(500).json({
    success: false,
    message: "Something went wrong.",
  });
});

module.exports = app;
