const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const router = express.Router();
const User = require('../models/User');


// Define models for each user type
const Student = mongoose.model('Student', new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  userType: { type: String, default: 'student' },
}));

const Staff = mongoose.model('Staff', new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  userType: { type: String, default: 'staff' },
}));

const Faculty = mongoose.model('Faculty', new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  userType: { type: String, default: 'faculty' },
}));

// POST /api/register - User registration
router.post('/register', async (req, res) => {
  const { firstname, lastname, email, password, userType } = req.body;

  try {
    // Check if email is already taken
    const existingUser = await Student.findOne({ email }) || await Staff.findOne({ email }) || await Faculty.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user based on userType
    let newUser;
    switch (userType) {
      case 'student':
        newUser = new Student({
          firstname,
          lastname,
          email,
          password: hashedPassword,
          userType,
        });
        break;
      case 'staff':
        newUser = new Staff({
          firstname,
          lastname,
          email,
          password: hashedPassword,
          userType,
        });
        break;
      case 'faculty':
        newUser = new Faculty({
          firstname,
          lastname,
          email,
          password: hashedPassword,
          userType,
        });
        break;
      default:
        return res.status(400).json({ message: 'Invalid user type' });
    }

    // Save the user to the corresponding collection
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
//login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Find the user in the appropriate collection
    const user = await Student.findOne({ email }) || await Staff.findOne({ email }) || await Faculty.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Generate a token
    const token = jwt.sign({ userId: user._id, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ success: true, token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
});


module.exports = router;
