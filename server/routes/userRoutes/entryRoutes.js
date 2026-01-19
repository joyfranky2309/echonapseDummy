const express = require("express");
const router = express.Router();
const Entry = require("../../schemas/entrySchema");

/* ================= CREATE NOTE ================= */
router.post("/", async (req, res) => {
  console.log("\n📥 [POST] /api/entries HIT");
  console.log("🔐 User:", req.user);
  console.log("📦 Body:", req.body);

  try {
    const { content, date, mood } = req.body;

    if (!content || !date) {
      console.log("❌ Missing content or date");
      return res.status(400).json({ message: "Content and date are required" });
    }

    const existing = await Entry.findOne({
      user: req.user.id,
      date,
    });

    if (existing) {
      console.log("⚠️ Note already exists for date:", date);
      return res
        .status(400)
        .json({ message: "Note already exists for this date" });
    }

    // ✅ SAVE MOOD
    const entry = await Entry.create({
      user: req.user.id,
      content,
      mood,            // ✅ ADDED
      date,
      author: "patient",
    });

    console.log("✅ Note saved:", entry);
    res.status(201).json(entry);
  } catch (err) {
    console.log("🔥 Create error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

/* ================= GET NOTES BY DATE ================= */
router.get("/", async (req, res) => {
  console.log("\n📤 [GET] /api/entries HIT");
  console.log("🔐 User:", req.user);
  console.log("📅 Query:", req.query);

  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const entries = await Entry.find({
      user: req.user.id,
      date,
    }).sort({ createdAt: -1 });

    console.log(`📄 Found ${entries.length} notes`);
    res.json(entries);
  } catch (err) {
    console.log("🔥 Fetch error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
