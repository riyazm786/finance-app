const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  source: { type: String, required: true },
  month: { type: String, required: true }, // format YYYY-MM
  year: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Income', IncomeSchema);
