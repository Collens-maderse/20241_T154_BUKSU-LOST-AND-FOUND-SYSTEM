const express = require('express');
const router = express.Router();
const Faculty = require('../models/Faculty');
const Student = require('../models/Student');
const Staff = require('../models/Staff');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
  try {
    console.log('Profile route accessed with user ID:', req.user.userId); // Debugging

    const user =
      (await Faculty.findById(req.user.userId).select('-password')) ||
      (await Staff.findById(req.user.userId).select('-password')) ||
      (await Student.findById(req.user.userId).select('-password')) ||
      (await User.findById(req.user.userId).select('-password'));

    if (!user) {
      console.error(`No user found for ID: ${req.user.userId}`);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user); // Debugging
    res.json({
      fullname: `${user.firstname} ${user.lastname}`,
      email: user.email,
      userType: user.userType,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    res.status(500).json({ message: 'Failed to fetch user profile', error: error.message });
  }
});

module.exports = router;
