// src/models/Blacklist.js
const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
  token:     { type: String, required: true },
  createdAt: { type: Date,   default: Date.now, expires: '1h' }
});

module.exports = mongoose.model('Blacklist', blacklistSchema);