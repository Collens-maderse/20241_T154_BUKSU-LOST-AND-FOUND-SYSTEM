const express = require('express');
const router = express.Router();
const Faculty = require('../models/Faculty'); // Ensure correct path to your Faculty model
const { protect } = require('../middleware/authMiddleware'); // Import middleware

// GET all faculty

router.get('/', protect, async (req, res) => {
    try {
      const faculty = await Faculty.find().select('-password'); // Fetch all staff and exclude passwords
      res.status(200).json(faculty);
    } catch (error) {
      console.error('Error fetching students:', error.message);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });

// GET specific faculty by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id); // Fetch faculty by ID
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }
    res.status(200).json(faculty);
  } catch (error) {
    console.error('Error fetching faculty:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
