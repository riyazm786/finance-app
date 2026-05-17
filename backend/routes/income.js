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
  const { amount, source, month, year, description, date } = req.body;

  try {
    const newIncome = new Income({
      userId: req.user.id,
      amount,
      source,
      month,
      year,
      description,
      date
    });

    const income = await newIncome.save();
    res.json(income);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/income/:id
// @desc    Delete income
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const income = await Income.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!income) return res.status(404).json({ msg: 'Income not found or not authorized' });

    res.json({ msg: 'Income removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
