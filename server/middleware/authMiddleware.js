const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const JWT_SECRET =
  process.env.JWT_SECRET || "your_jwt_secret_key_change_this_in_production";

/* ===================== Middleware ===================== */

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("🔐 Auth Header:", authHeader);

    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
    if (!token) {
      console.log("❌ No token provided");
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("✅ Token decoded:", decoded);

    // ✅ THIS IS THE IMPORTANT FIX
    req.user = {
      id: decoded.userId,
    };

    next();
  } catch (error) {
    console.log("❌ Token verification failed:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }

    return res.status(401).json({ message: "Invalid token" });
  }
};

/* ===================== Token Generation ===================== */

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "1h",
  });
};

module.exports = {
  verifyToken,
  generateAccessToken,
  JWT_SECRET,
};
