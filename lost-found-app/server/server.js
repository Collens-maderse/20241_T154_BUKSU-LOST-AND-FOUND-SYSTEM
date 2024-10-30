const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');

dotenv.config();
connectDB();

const app = express();

app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use(cors());
app.use(express.json());

// Basic route for checking server status
app.get('/', (req, res) => {
  res.send('Lost and Found API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
