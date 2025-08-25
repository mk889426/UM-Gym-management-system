// src/models/Supplement.js
const mongoose = require('mongoose');

const supplementSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 }
});

module.exports = mongoose.model('Supplement', supplementSchema);