const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../../schemas/userSchema");
const { generateAccessToken } = require("../../middleware/authMiddleware");

/* ===================== REGISTER ===================== */
router.post("/register", async (req, res) => {
  try {
    const { name, age, phone, email, password, conditionLevel, caretakers } =
      req.body;

    if (!name || !age || !phone || !email || !password || !conditionLevel) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User with this email or phone already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      age,
      phone,
      email,
      password: hashedPassword,
      conditionLevel,
      caretakers: caretakers || [],
    });

    await newUser.save();

    const token = generateAccessToken(newUser._id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      userId: newUser._id,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({
      message: "Error registering user",
      error: error.message,
    });
  }
});

/* ===================== LOGIN ===================== */
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Identifier and password are required" });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateAccessToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
      userId: user._id,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({
      message: "Error logging in",
      error: error.message,
    });
  }
});

module.exports = router;
