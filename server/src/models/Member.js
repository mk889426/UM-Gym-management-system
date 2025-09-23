const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:       { type: String, required: true },
  contact:    { type: String, required: true },
  address:    { type: String, required: true },
  feePackage: { type: String, default: '' },
  joinDate:   { type: Date, default: Date.now } 
});

module.exports = mongoose.model('Member', memberSchema);
