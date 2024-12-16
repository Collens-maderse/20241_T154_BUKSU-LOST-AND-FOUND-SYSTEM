const express = require('express');
const router = express.Router();
const Student = require('../models/Student'); // Adjust path to Student model
const { protect } = require('../middleware/authMiddleware'); // Include token validation middleware if required

// GET: Fetch all students
router.get('/', protect, async (req, res) => {
    try {
      const students = await Student.find().select('-password'); // Fetch all students and exclude passwords
      res.status(200).json(students);
    } catch (error) {
      console.error('Error fetching students:', error.message);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });

// GET: Fetch a specific student by ID
router.get('/:id', protect, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id); // Fetch student by ID
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (error) {
        console.error('Error fetching student:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.get('/', (req, res) => {
  console.log('GET /api/students accessed');
  res.json({ message: 'Students endpoint works' });
});

module.exports = router;
