const express = require("express");
const router = express.Router();
const User = require("../../schemas/userSchema");
const upload = require("../../middleware/upload");

console.log("✅ userRoutes file loaded");

/* ===================== GET CURRENT USER PROFILE ===================== */
router.get("/me", async (req, res) => {
  try {
    console.log("🧠 USER ID FROM TOKEN:", req.user.id);

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("❌ PROFILE ERROR:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

/* ===================== UPLOAD PATIENT PHOTO ===================== */
router.post(
  "/upload-patient-photo",

  // ✅ PRE-MIDDLEWARE: set filename BEFORE multer runs
  (req, res, next) => {
    req.uploadFileName = "patient.jpg";
    next();
  },

  upload.single("photo"),

  async (req, res) => {
    try {
      const photoPath = `/uploads/users/${req.user.id}/patient.jpg`;

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { photo: photoPath },
        { new: true }
      ).select("-password");

      res.json(user);
    } catch (err) {
      console.error("❌ Patient photo upload failed:", err);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

/* ===================== UPLOAD CARETAKER PHOTO ===================== */
router.post(
  "/upload-caretaker-photo/:index",

  // ✅ PRE-MIDDLEWARE: set filename BEFORE multer runs
  (req, res, next) => {
    req.uploadFileName = `caretaker_${req.params.index}.jpg`;
    next();
  },

  upload.single("photo"),

  async (req, res) => {
    try {
      const index = parseInt(req.params.index, 10);

      if (isNaN(index)) {
        return res.status(400).json({ message: "Invalid caretaker index" });
      }

      const photoPath = `/uploads/users/${req.user.id}/caretaker_${index}.jpg`;

      const user = await User.findById(req.user.id);

      if (!user || !user.caretakers[index]) {
        return res.status(404).json({ message: "Caretaker not found" });
      }

      user.caretakers[index].photo = photoPath;
      await user.save();

      res.json(user);
    } catch (err) {
      console.error("❌ Caretaker photo upload failed:", err);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

module.exports = router;
