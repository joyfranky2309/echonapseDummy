const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const JWT_SECRET =
  process.env.JWT_SECRET || "your_jwt_secret_key_change_this_in_production";

/* ===================== Middleware ===================== */

// Verify Access Token Middleware
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }

    return res.status(401).json({ message: "Invalid token" });
  }
};

/* ===================== Token Generation ===================== */

// Generate Access Token (expires in 15 minutes)
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "30m",
  });
};

module.exports = {
  verifyToken,
  generateAccessToken,
  JWT_SECRET,
};
