const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Report', reportSchema);
