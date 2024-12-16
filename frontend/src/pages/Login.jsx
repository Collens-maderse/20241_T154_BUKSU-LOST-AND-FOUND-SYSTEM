import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../assets/Logo.jpg'
import '../styles/Login.css';

const Login = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = 'http://localhost:5000/api/auth/login';
      const res = await axios.post(endpoint, loginData);
      const { token, userType } = res.data;

      if (token) {
        localStorage.setItem('token', token);
        userType === 'admin' ? navigate('/admin') : navigate('/user-home');
      } else {
        alert('Login failed: Invalid response from server.');
      }
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      alert('Login failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    try {
      const googleToken = response.credential;
      const res = await axios.post('http://localhost:5000/api/auth/google', { token: googleToken });
      const { success, token, userType } = res.data;

      if (success) {
        localStorage.setItem('token', token);
        userType === 'admin' ? navigate('/admin') : navigate('/user-home');
      } else {
        alert('Google login failed.');
      }
    } catch (error) {
      console.error('Google login error:', error.response?.data || error.message);
      alert('Google login failed.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        {/* Left Side */}
        <div className="login-left">
          <img src={Logo} alt="BukSU Logo" className="logo" /> {/* Add the BukSU logo */}
        </div>

        {/* Right Side */}
        <div className="login-right">
          <h1>BukSU Lost and Found</h1>
          <h2>Join today.</h2>
    
          
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

          <div className="divider">or</div>

          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() => console.log('Google Login Failed')}
          />
          <p className="signin">
            You don't have an account? <a href="/register" className="signin-link">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
