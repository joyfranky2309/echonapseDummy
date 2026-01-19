const mongoose = require('mongoose');

const caretakerSchema = new mongoose.Schema({
  caretakerName: {
    type: String,
    required: true,
  },
  phno: {
    type: String,
    required: true,
  },
  relation: {
    type: String,
    required: true,
  },
  emailID: {
    type: String,
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  phno: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    required: true,
  },
  caretakerDetails: [caretakerSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
