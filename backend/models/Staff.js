const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  userType: { type: String, default: 'staff' }
});

module.exports = mongoose.model('Staff', StudentSchema);
