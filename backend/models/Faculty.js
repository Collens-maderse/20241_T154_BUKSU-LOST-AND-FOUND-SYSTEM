const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  userType: { type: String, default: 'faculty' },
  isGoogleUser: { type: Boolean, default: false },
},{ timestamps: true });

module.exports = mongoose.models.Faculty || mongoose.model('Faculty', FacultySchema);
