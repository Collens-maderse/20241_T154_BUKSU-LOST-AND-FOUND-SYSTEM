const express = require('express');
const Faculty = require('../models/Faculty');
const Staff = require('../models/Staff');
const Student = require('../models/Student');
const User = require("../models/User"); // Import the User model


const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/all-users', protect, adminOnly, async (req, res) => {
  try {
    const faculty = await Faculty.find().select('-password');
    const staff = await Staff.find().select('-password');
    const students = await Student.find().select('-password');

    const allUsers = [
      ...faculty.map(user => ({ ...user._doc, userType: 'faculty' })),
      ...staff.map(user => ({ ...user._doc, userType: 'staff' })),
      ...students.map(user => ({ ...user._doc, userType: 'student' })),
    ];

    res.status(200).json(allUsers);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Error fetching users.', error: error.message });
  }
});

// DELETE /api/users/:id - Delete a user
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    // Attempt to delete from Faculty, Staff, and Student collections
    let user = await Faculty.findByIdAndDelete(req.params.id);
    if (!user) {
      user = await Staff.findByIdAndDelete(req.params.id);
    }
    if (!user) {
      user = await Student.findByIdAndDelete(req.params.id);
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
});

router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const { firstname, lastname, email, password, userType } = req.body;

    let user;
    switch (userType) {
      case "faculty":
        user = await Faculty.findById(req.params.id);
        break;
      case "staff":
        user = await Staff.findById(req.params.id);
        break;
      case "student":
        user = await Student.findById(req.params.id);
        break;
      default:
        return res.status(400).json({ message: "Invalid user type" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields if provided
    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (email) user.email = email;

    // Update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ message: "Failed to update user", error: error.message });
  }
});



module.exports = router;
