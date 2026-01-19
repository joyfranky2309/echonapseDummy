const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userDir = path.join("uploads", "users", req.user.id);
    fs.mkdirSync(userDir, { recursive: true });
    cb(null, userDir);
  },

  filename: (req, file, cb) => {
    cb(null, req.uploadFileName); // ✅ always defined
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files allowed"), false);
  }
};

module.exports = multer({ storage, fileFilter });
