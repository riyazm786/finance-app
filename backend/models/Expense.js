const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  date: { type: String, required: true } // format YYYY-MM-DD
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);
