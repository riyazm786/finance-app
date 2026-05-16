const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Expense = require('../models/Expense');

// @route   GET api/expenses
// @desc    Get all expenses for logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/expenses
// @desc    Add new expense
// @access  Private
router.post('/', auth, async (req, res) => {
  const { amount, category, description, date } = req.body;

  try {
    const newExpense = new Expense({
      userId: req.user.id,
      amount,
      category,
      description,
      date
    });

    const expense = await newExpense.save();
    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/expenses/:id
// @desc    Delete expense
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: 'Expense not found' });

    // Make sure user owns expense
    if (expense.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Expense.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Expense removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
