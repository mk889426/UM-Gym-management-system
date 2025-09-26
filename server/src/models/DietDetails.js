// src/models/DietDetail.js
const mongoose = require('mongoose');

const dietDetails = new mongoose.Schema(
  {
    member:   { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    dietPlan: { type: String, required: true }
  },
  { timestamps: true } 
);

module.exports = mongoose.model('DietDetail', dietDetails);
