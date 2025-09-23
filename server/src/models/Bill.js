
const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now },
  status: { type: String, enum: ['paid', 'pending'], default: 'pending' } // ✅ added
});

module.exports = mongoose.model('Bill', billSchema);
