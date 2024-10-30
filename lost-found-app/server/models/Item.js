const mongoose = require('mongoose');
const ItemSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  location: String,
  dateLostOrFound: Date,
  status: { type: String, enum: ['lost', 'found'], default: 'lost' },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});
module.exports = mongoose.model('Item', ItemSchema);
