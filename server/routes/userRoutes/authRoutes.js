const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../../schemas/userSchema");
const { generateAccessToken, verifyToken } = require("../../middleware/authMiddleware");

/* ===================== REGISTER ===================== */
router.get("/auth/google", verifyToken, (req, res) => {
  const url =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      response_type: "code",
      scope: "https://www.googleapis.com/auth/calendar.events",
      access_type: "offline",
      prompt: "consent",
      state: req.user.id, // IMPORTANT
    });

  res.redirect(url);
});
const axios = require("axios");

router.get("/auth/google/callback", async (req, res) => {
  const { code, state } = req.query; // state = userId

  if (!code || !state) {
    return res.status(400).json({ message: "Missing code or state" });
  }

  try {
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }
    );

    const { refresh_token } = tokenRes.data;

    if (!refresh_token) {
      return res.status(400).json({
        message: "No refresh token received. Did you force consent?",
      });
    }

    await User.findByIdAndUpdate(state, {
      googleRefreshToken: refresh_token,
    });

    res.json({
      message: "Google Calendar connected successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Google OAuth failed",
      error: err.response?.data || err.message,
    });
  }
});

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
