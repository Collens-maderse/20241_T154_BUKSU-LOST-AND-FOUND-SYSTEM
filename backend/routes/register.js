router.post('/register', async (req, res) => {
  const { firstname, lastname, email, password, userType } = req.body;

  // Check if email already exists
  let existingUser;
  if (userType === 'student') {
    existingUser = await Student.findOne({ email });
  } else if (userType === 'staff') {
    existingUser = await Staff.findOne({ email });
  } else if (userType === 'faculty') {
    existingUser = await Faculty.findOne({ email });
  }

  if (existingUser) {
    return res.status(400).send('Email already in use');
  }

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
