// src/models/Bill.js
const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  amount: { type: Number, required: true },
  date:   { type: Date,   required: true, default: Date.now }
});

module.exports = mongoose.model('Bill', billSchema);