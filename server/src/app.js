const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10kb" }));

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is Running" });
});
app.use("/api/auth", authRoutes);

module.exports = app;
