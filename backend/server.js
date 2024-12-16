const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoute = require('./routes/authRoutes');
const itemRoute = require('./routes/itemRoutes'); // Item routes
const userRoutes = require('./routes/userRoutes'); // Import the user routes
const profileRoutes = require('./routes/profilepageRoute');
const studentsRoute = require('./routes/studentRoutes'); // Adjust path as needed
const staffRoutes = require('./routes/staffRoutes'); // Ensure correct path
const facultyRoutes = require('./routes/facultyRoutes'); // Ensure correct path
const notificationRoutes = require('./routes/notificationRoutes');
const contactRoutes = require("./routes/contact"); // Import the contact routes
const app = express();

// Load environment variables
dotenv.config();

// Middleware: CORS Configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow Authorization header for JWT
};
app.use(cors(corsOptions));

// Middleware for COOP and COEP headers
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin'); // Allow same-origin access
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp'); // Allow embedding resources from other origins
  next();
});

// Middleware: Body parser
app.use(express.json()); // Parse incoming JSON requests

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    tlsAllowInvalidCertificates: true,
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1); // Exit the process if DB connection fails
  });

// Routes
app.use('/api/auth', authRoute); // Authentication routes
app.use('/api/items', itemRoute); // Item routes
app.use('/api/users', userRoutes); // Admin-related user routes
app.use('/api/profile', profileRoutes); // Profile routes under /api/auth 
app.use('/api/students', studentsRoute);
app.use('/api/staff', staffRoutes); // Add staff routes
app.use('/api/faculty', facultyRoutes); // Add faculty routes
app.use('/api/notifications', notificationRoutes); //notifications
app.use("/api/contact", contactRoutes); // Register the contact routes
// Default route for undefined endpoints 
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Global error handler for unexpected errors
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack || err.message);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
