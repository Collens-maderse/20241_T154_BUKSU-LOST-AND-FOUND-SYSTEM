const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoute = require('./routes/authRoutes.js'); // Make sure this path is correct

const app = express();

// Load environment variables
dotenv.config();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Allow only your frontend's address
  methods: ['GET', 'POST'],
  credentials: true, // If you plan to use cookies or sessions
};

// Apply CORS configuration
app.use(cors(corsOptions)); // Enable CORS with the defined options

// Middleware
app.use(express.json()); // For parsing application/json

// Use the routes
app.use('/api', authRoute);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log('MongoDB connection error:', error));

// Start the server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
