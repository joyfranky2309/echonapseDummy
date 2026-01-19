const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");

const userRoutes = require("./routes/userRoutes/userRoutes");
const entryRoutes = require("./routes/userRoutes/entryRoutes");
const authRoutes = require("./routes/userRoutes/authRoutes");
const agentRoutes = require("./routes/agentRoutes/agent");
const { verifyToken } = require("./middleware/authMiddleware");

const app = express();

/* ===================== Middleware ===================== */

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* ===================== Routes ===================== */

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Public routes (no auth)
//app.use("/api", authRoutes);
app.use("/api/auth", authRoutes);

// Protected routes (auth required)
// app.use("/api", verifyToken, userRoutes);
// app.use("/api", verifyToken, entryRoutes);
app.use("/api/users",verifyToken,userRoutes);
app.use("/api/entries",verifyToken,entryRoutes);
// Health / sanity check
app.get("/ping", (req, res) => {
  res.json({ ok: true, message: "Backend is alive 🚀" });
});

app.use("/api/agent", verifyToken, agentRoutes);

/* ===================== Database ===================== */

const dbConnect = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/EchoNapse");
    console.log("✅ Database connected successfully");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
};

/* ===================== Server Start ===================== */

const PORT = process.env.PORT || 5000;

dbConnect().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
});
