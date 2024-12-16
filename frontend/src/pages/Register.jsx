import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';
import Logo from '../assets/Logo.jpg'; // BukSU Logo path
import '../styles/Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    userType: 'student',
  });
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const onRecaptchaChange = (value) => setRecaptchaValue(value);

  const validateForm = () => {
    if (!formData.firstname || !formData.lastname || !formData.email || !formData.password) {
      return 'All fields are required.';
    }
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(formData.email)) return 'Please enter a valid email address.';
    if (formData.password.length < 6) return 'Password must be at least 6 characters long.';
    if (!recaptchaValue) return 'Please verify that you are not a robot.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert('Registration successful!');
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      setErrorMessage('Email is already registered.');
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/google', {
        token: response.credential,
      });
      if (res.data.success) navigate('/user-home');
    } catch (error) {
      console.error('Google Signup Failed:', error);
    }
  };

  return (
    <div className="register-page">
      <div className="register-wrapper">
        {/* Left Side */}
        <div className="register-left">
          <img src={Logo} alt="BukSU Logo" className="logo" />
        </div>

        {/* Right Side */}
        <div className="register-right">
          <h1>BukSU Lost and Found</h1>
          <h2>Join today.</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="First Name"
              value={formData.firstname}
              onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={formData.lastname}
              onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <select
              value={formData.userType}
              onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
            >
              <option value="student">Student</option>
              <option value="staff">Staff</option>
              <option value="faculty">Faculty</option>
            </select>

            <ReCAPTCHA
              sitekey="6LeWFX4qAAAAALBsKNJ-PITPdlzrAb5zH3aHs8bz"
              onChange={onRecaptchaChange}
            />

            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <button type="submit" className="register-button">
              Register
            </button>
          </form>

          <div className="divider">or</div>

          <div className="google-login">
  <GoogleLogin
    onSuccess={handleGoogleSuccess}
    onError={() => console.log('Google login failed')}
  />
</div>


          <p className="signin">
            Already have an account? <a href="/login" className="signin-link">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
