// controllers/authController.js
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateAccessToken } = require("../middleware/authMiddleware");

/* ================= REGISTER ================= */
exports.register = async (req, res) => {
  try {
    const {
      name,
      age,
      phone,
      email,
      password,
      conditionLevel,
      caretakers,
    } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      age,
      phone,
      email,
      password: hashedPassword,
      conditionLevel,
      caretakers,
    });

    const token = generateAccessToken(user._id);

    res.status(201).json({
      message: "Registered successfully",
      token,
      userId: user._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateAccessToken(user._id);

    res.json({
      message: "Login successful",
      token,
      userId: user._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
