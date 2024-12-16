const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const router = express.Router();
const { protect, adminOnly, userOnly } = require('../middleware/authMiddleware');
const Admin = require('../models/Admin'); // Assuming you have an Admin model
const User = require('../models/User'); // Assuming you have a User model

// Models
const Student = mongoose.model(
  'Student',
  new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    userType: { type: String, default: 'student' },
    isGoogleUser: { type: Boolean, default: false },
  })
);

const Staff = mongoose.model(
  'Staff',
  new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    userType: { type: String, default: 'staff' },
    isGoogleUser: { type: Boolean, default: false },
  })
);

const Faculty = mongoose.model(
  'Faculty',
  new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    userType: { type: String, default: 'faculty' },
    isGoogleUser: { type: Boolean, default: false },
  })
);


// Initialize Google OAuth client
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the user info to the request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// Helper function to find a user by email
const findUserByEmail = async (email) => {
  return (
    (await Student.findOne({ email })) ||
    (await Staff.findOne({ email })) ||
    (await Faculty.findOne({ email }))
  );
};

// POST /api/register - User registration
router.post('/register', async (req, res) => {
  const { firstname, lastname, email, password, userType } = req.body;
  try {
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;
    switch (userType) {
      case 'student':
        newUser = new Student({ firstname, lastname, email, password: hashedPassword, userType });
        break;
      case 'staff':
        newUser = new Staff({ firstname, lastname, email, password: hashedPassword, userType });
        break;
      case 'faculty':
        newUser = new Faculty({ firstname, lastname, email, password: hashedPassword, userType });
        break;
      default:
        return res.status(400).json({ message: 'Invalid user type' });
    }
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/auth/login - User login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ success: true, token, userType: user.userType });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/auth/google - Google login
router.post('/google/', async (req, res) => {
  console.log('Received Google login request'); // Debugging log

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Google token is required.' });
  }

  try {
    // Verify the Google token using Google OAuth2Client
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // Ensure this is correct
    });

    // Get the user's Google profile information
    const payload = ticket.getPayload();
    const userId = payload.sub;  // The user's Google ID

    // Optionally, check if the user already exists in your database
    let user = await findUserByEmail(payload.email);
    if (!user) {
      // If the user does not exist, you can create a new one based on the Google data
      // You can choose the model (Student, Faculty, Staff) based on your logic
      user = new Student({
        firstname: payload.given_name,
        lastname: payload.family_name,
        email: payload.email,
        userType: 'student',  // You can change this based on your logic
        isGoogleUser: true,
      });
      await user.save();
    }

    // Generate a JWT for the user
    const authToken = jwt.sign(
      { userId: user._id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      success: true,
      token: authToken,
      user: {
        id: user._id,
        email: user.email,
        userType: user.userType,
      },
    });
  } catch (error) {
    console.error('Google login error:', error.message);
    res.status(500).json({ message: 'Google login failed.' });
  }
});

// Route to get all users (only admin)
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Route to delete a user (only admin)
router.delete('/user/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

router.post('/register', async (req, res) => {
  const { email, password, userType } = req.body;

  // Validate input data
  if (!email || !password || !userType) {
    return res.status(400).json({ message: 'Email, password, and userType are required.' });
  }

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = new User({
      email,
      password: hashedPassword,
      userType,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});


router.post('/admin-login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: admin._id, email: admin.email, userType: admin.userType },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, userType: admin.userType });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error.' });
  }
});
// Helper function to find and delete a user by ID
const findAndDeleteUserById = async (userId) => {
  const models = [Student, Staff, Faculty, User];
  for (const model of models) {
    const deletedUser = await model.findByIdAndDelete(userId);
    if (deletedUser) {
      return deletedUser; // Return the deleted user if found
    }
  }
  return null; // Return null if no user was found in any model
};

// DELETE /api/auth/delete-account
// DELETE /api/auth/delete-account
// DELETE /api/auth/delete-account
router.delete('/delete-account', protect, async (req, res) => {
  try {
    const userId = req.user.userId; // Extract the user ID from the JWT
    console.log(`User ID for deletion: ${userId}`);

    const deletedUser = await findAndDeleteUserById(userId);

    if (!deletedUser) {
      console.error(`User not found for ID: ${userId}`);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`User deleted: ${deletedUser.email}`);
    res.status(200).json({ message: 'Account deleted successfully.' });
  } catch (error) {
    console.error('Error deleting account:', error.message);
    res.status(500).json({ message: 'Failed to delete account.', error: error.message });
  }
});


module.exports = router;