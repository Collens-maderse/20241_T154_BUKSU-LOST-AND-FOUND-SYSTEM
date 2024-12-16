const express = require('express');
const multer = require('multer');
const path = require('path');
const Item = require('../models/Item');
const Notification = require('../models/Notification'); // Assuming Notification model exists
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// POST /api/items - Create a new item
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { description, category, postType } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required.' });
    }

    const newItem = new Item({
      description,
      category,
      image: req.file.filename,
      postType,
      postedBy: req.user.userId, // Use req.user.userId from the protect middleware
    });

    console.log('New Item Details:', newItem); // Debug log
    await newItem.save();

    res.status(201).json({ message: 'Item posted successfully', item: newItem });
  } catch (error) {
    console.error('Error posting item:', error.message);
    res.status(500).json({ message: 'Failed to post item', error: error.message });
  }
});



// GET /api/items - Fetch all items
// GET /api/items - Fetch all items
router.get('/', protect, async (req, res) => {
  try {
    const items = await Item.find()
      .populate('postedBy', 'firstname lastname') // Populate firstname and lastname of the poster
      .sort({ createdAt: -1 }); // Optional: Sort by newest first

    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching items:', error.message);
    res.status(500).json({ message: 'Failed to fetch items', error: error.message });
  }
});




// GET /api/items/user - Fetch items posted by the logged-in user
router.get('/user', protect, async (req, res) => {
  try {
    const items = await Item.find({ postedBy: req.user.userId });
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching user items:', error.message);
    res.status(500).json({ message: 'Failed to fetch user items', error: error.message });
  }
});

// POST /api/items/:id/like - Like or unlike an item
router.post('/:id/like', protect, async (req, res) => {
  try {
    const itemId = req.params.id;
    const userId = req.user.userId;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const isLiked = item.likedBy.includes(userId);

    if (isLiked) {
      // Unlike the item
      item.likedBy = item.likedBy.filter((id) => id.toString() !== userId.toString());
      item.likes -= 1;
    } else {
      // Like the item
      item.likedBy.push(userId);
      item.likes += 1;

      // Create a notification for the item's owner
      if (item.postedBy.toString() !== userId.toString()) {
        const notification = new Notification({
          recipient: item.postedBy, // Item owner
          sender: userId, // User who liked the item
          item: itemId, // The liked item
          type: 'like', // Notification type
        });

        await notification.save();
      }
    }

    await item.save();
    res.status(200).json({ likes: item.likes, isLiked: !isLiked });
  } catch (err) {
    console.error('Error toggling like:', err.message);
    res.status(500).json({ message: 'Failed to toggle like.', error: err.message });
  }
});

// GET /api/notifications - Fetch all notifications
router.get('/notifications', protect, async (req, res) => {
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
