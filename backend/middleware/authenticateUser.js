const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract token after 'Bearer'

  if (!token) {
    return res.status(401).json({ message: 'Authentication token is missing.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decodes the JWT token using the secret key
    req.user = decoded; // Attach the decoded token payload to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Authentication failed:', error.message);
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authenticateUser;
