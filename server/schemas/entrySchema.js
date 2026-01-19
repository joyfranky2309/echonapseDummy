const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    mood: {
      type: String,
      default: "",
    },

    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },

    author: {
      type: String,
      enum: ["patient"],
      default: "patient",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Entry", entrySchema);
