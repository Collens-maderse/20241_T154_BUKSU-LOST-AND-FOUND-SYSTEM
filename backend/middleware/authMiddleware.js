const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes and decode JWT
// Middleware to protect routes and decode JWT
const protect = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user to the request
    next();
  } catch (error) { 
    return res.status(401).json({
      message: 'Token verification failed',
      error: error.message,
    });
  }
};

// Middleware to allow only admin users
const adminOnly = (req, res, next) => {
  if (req.user?.userType !== 'admin') {
    console.error('Access denied. User is not an admin:', req.user?.userType);
    return res.status(403).json({ message: 'Admins only' });
  }
  next();
};

// Middleware to verify ownership for user-specific actions (e.g., deleting own account)
const userOnly = (req, res, next) => {
  if (!req.user?.userId) {
    console.error('Access denied. User ID is missing in token.');
    return res.status(403).json({ message: 'Access denied. Invalid user.' });
  }
  next();
};

// Export the middleware functions
module.exports = { protect, adminOnly, userOnly };
