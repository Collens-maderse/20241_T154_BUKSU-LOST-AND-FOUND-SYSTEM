const express = require('express');
const router = express.Router();
const { addItem, getItems } = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

// Route to add a new item
router.post('/', protect, addItem);

// Route to get all items
router.get('/', getItems);

module.exports = router;
