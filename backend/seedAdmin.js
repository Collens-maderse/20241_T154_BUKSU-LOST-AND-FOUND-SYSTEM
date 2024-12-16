const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Admin = require('./models/Admin'); // Ensure the path is correct

dotenv.config(); // Load environment variables

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const hashedPassword = await bcrypt.hash('admin123', 10); // Replace 'admin123' with desired admin password
    const adminData = {
      email: 'admin@example.com', // Replace with desired admin email
      password: hashedPassword,
      userType: 'admin',
    };

    const existingAdmin = await Admin.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('Admin already exists');
    } else {
      const admin = new Admin(adminData);
      await admin.save();
      console.log('Admin user seeded successfully');
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding admin user:', error.message);
    process.exit(1); // Exit with failure
  }
};

seedAdmin();
