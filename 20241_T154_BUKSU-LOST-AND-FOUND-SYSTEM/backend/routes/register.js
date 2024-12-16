const express = require('express');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const Staff = require('../models/Staff');
const Faculty = require('../models/Faculty');

const router = express.Router();

router.post('/register', async (req, res) => {
   const { firstname, lastname, email, password, userType } = req.body;

   // Hash password
   const hashedPassword = await bcrypt.hash(password, 10);

   try {
     let user;
     if (userType === 'student') {
       user = new Student({ firstname, lastname, email, password: hashedPassword });
     } else if (userType === 'staff') {
       user = new Staff({ firstname, lastname, email, password: hashedPassword });
     } else if (userType === 'faculty') {
       user = new Faculty({ firstname, lastname, email, password: hashedPassword });
     }
     
     await user.save();
     res.status(201).send('User registered successfully');
   } catch (error) {
     res.status(400).send('Error registering user');
   }
});

module.exports = router;
