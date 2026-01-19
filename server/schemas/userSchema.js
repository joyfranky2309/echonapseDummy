// models/User.js
const mongoose = require("mongoose");

const caretakerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  relation: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },

  // ✅ caretaker photo path
  photo: {
    type: String, // e.g. "/uploads/users/<userId>/caretaker_0.jpg"
    default: "",
  },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },

    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    conditionLevel: {
      type: String,
      enum: ["1", "2", "3"],
      required: true,
    },

    // ✅ patient photo path
    photo: {
      type: String, // e.g. "/uploads/users/<userId>/patient.jpg"
      default: "",
    },

    caretakers: {
      type: [caretakerSchema],
      validate: [
        (arr) => arr.length >= 1,
        "At least one caretaker required",
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
