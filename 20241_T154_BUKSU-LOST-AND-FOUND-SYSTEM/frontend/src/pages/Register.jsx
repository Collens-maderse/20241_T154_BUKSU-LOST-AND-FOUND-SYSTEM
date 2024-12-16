import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importing useNavigate for redirection
import '../styles/Register.css';

const Register = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    userType: 'student',  // Default value
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update the API URL to include the correct port (5000)
      const response = await axios.post('http://localhost:5000/api/register', formData);
      
      // If registration is successful, alert and navigate to login page
      alert('User registered successfully');
      navigate('/login'); // Redirect to the login page
    } catch (error) {
      alert('Registration failed');
      console.error(error);
    }
  };

  const handleGoogleSignup = () => {
    // Redirect to Google OAuth flow, to be handled in the backend
    window.location.href = '/auth/google';
  };

  return (
    <div className="register">
      <h2>Create an Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name</label>
          <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>User Type</label>
          <select name="userType" value={formData.userType} onChange={handleChange} required>
            <option value="student">Student</option>
            <option value="staff">Staff</option>
            <option value="faculty">Faculty</option>
          </select>
        </div>
        <button type="submit" className="register-button">Register</button>
      </form>
      <div className="divider">or</div>
      <button onClick={handleGoogleSignup} className="google-signup">
        <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google icon" />
        Continue with Google
      </button>
    </div>
  );
};

export default Register;
