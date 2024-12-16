const express = require('express');
const { protect } = require('../middleware/authMiddleware'); // Assuming you have this middleware for authentication
const Notification = require('../models/Notification'); // Import the Notification model

const router = express.Router();

// GET /api/notifications - Fetch all notifications for the logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.userId })
      .populate('sender', 'firstname lastname')
      .populate('item', 'description')
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err.message);
    res.status(500).json({ message: 'Failed to fetch notifications', error: err.message });
  }
});

module.exports = router;
