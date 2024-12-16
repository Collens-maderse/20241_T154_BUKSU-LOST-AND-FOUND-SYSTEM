const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff'); // Ensure correct path to your Staff model
const { protect } = require('../middleware/authMiddleware'); // Import middleware

// GET all staff


router.get('/', protect, async (req, res) => {
    try {
      const staff = await Staff.find().select('-password'); // Fetch all staff and exclude passwords
      res.status(200).json(staff);
    } catch (error) {
      console.error('Error fetching students:', error.message);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });

// GET specific staff by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id); // Fetch staff by ID
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.status(200).json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
