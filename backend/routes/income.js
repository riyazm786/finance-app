const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Income = require('../models/Income');

// @route   GET api/income
// @desc    Get all income records
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const incomes = await Income.find({ userId: req.user.id }).sort({ year: -1, month: -1 });
    res.json(incomes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/income
// @desc    Add income record
// @access  Private
router.post('/', auth, async (req, res) => {
  const { amount, source, month, year } = req.body;

  try {
    const newIncome = new Income({
      userId: req.user.id,
      amount,
      source,
      month,
      year
    });

    const income = await newIncome.save();
    res.json(income);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
