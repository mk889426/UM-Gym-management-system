// src/models/DietDetail.js
const mongoose = require('mongoose');

const dietDetailSchema = new mongoose.Schema({
  member:   { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  dietPlan: { type: String, required: true }
});

module.exports = mongoose.model('DietDetail', dietDetailSchema);