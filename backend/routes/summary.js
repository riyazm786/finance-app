const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Expense = require('../models/Expense');
const Income = require('../models/Income');

// @route   GET api/summary
// @desc    Get total income, total expense, savings
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id });
    const incomes = await Income.find({ userId: req.user.id });

    const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
    const savings = totalIncome - totalExpense;

    res.json({
      totalIncome,
      totalExpense,
      savings
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
