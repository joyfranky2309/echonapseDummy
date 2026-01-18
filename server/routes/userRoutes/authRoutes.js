const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../../schemas/userSchema");
const { generateAccessToken } = require("../../middleware/authMiddleware");

/* ===================== REGISTER ===================== */

router.post("/auth/register", async (req, res) => {
  try {
    const { fullName, phno, email, password, condition, caretakerDetails } =
      req.body;

    // Validate required fields
    if (!fullName || !phno || !email || !password || !condition) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    // Validate password strength
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phno }],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User with this email or phone number already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      fullName,
      phno,
      email,
      password: hashedPassword,
      condition,
      caretakerDetails: caretakerDetails || [],
    });

    await newUser.save();

    // Generate access token
    const accessToken = generateAccessToken(newUser._id);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        phno: newUser.phno,
      },
      accessToken,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error registering user",
      error: error.message,
    });
  }
});

/* ===================== LOGIN ===================== */

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate access token
    const accessToken = generateAccessToken(user._id);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phno: user.phno,
      },
      accessToken,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error logging in",
      error: error.message,
    });
  }
});

module.exports = router;
