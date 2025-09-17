// src/models/Member.js
const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:       { type: String, required: true },
  contact:    { type: String, required: true },   // new field
  address:    { type: String, required: true },   // new field
  feePackage: { type: String, default: '' }
});

module.exports = mongoose.model('Member', memberSchema);
