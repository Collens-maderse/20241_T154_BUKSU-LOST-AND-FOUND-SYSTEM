// pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import axios from 'axios';
import '../styles/Login.css';

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  
  const navigate = useNavigate();  // Initialize navigate to redirect

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', loginData);
      console.log('Response:', response.data);  // Check the response data
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        navigate('/user-home');
      } else {
        alert('Login failed');
      }
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);  // Log the error message
      alert('Login failed');
    }
  };
  

  return (
    <div className="login">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default Login;
