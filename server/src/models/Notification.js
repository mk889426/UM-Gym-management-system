// src/models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  member:  { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  message: { type: String, required: true },
  date:    { type: Date,   required: true, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);