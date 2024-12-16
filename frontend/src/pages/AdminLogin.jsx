import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../assets/Logo.jpg'; // Path to your BukSU logo
import '../styles/AdminLogin.css'; // Use the existing Login.css style for consistency

const AdminLogin = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/admin-login', loginData);

      // Save token to local storage
      localStorage.setItem('authToken', response.data.token);

      alert('Login successful!');
      navigate('/admin'); // Redirect to the admin dashboard
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        {/* Left Side */}
        <div className="login-left">
          <img src={Logo} alt="BukSU Logo" className="logo" /> {/* Logo */}
        </div>

        {/* Right Side */}
        <div className="login-right">
          <h1>BukSU Admin Panel</h1>
          <h2>Sign in to manage the system</h2>

          {error && <p className="error-message">{error}</p>} {/* Error message */}

          {/* Admin Login Form */}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={loginData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleChange}
              required
            />
            <button type="submit" className="create-account">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
