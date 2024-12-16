const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  postType: { type: String, required: true, enum: ['Lost', 'Found'] },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Item', itemSchema);
