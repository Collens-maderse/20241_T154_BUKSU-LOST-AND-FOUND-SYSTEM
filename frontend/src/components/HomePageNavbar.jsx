// src/components/HomePageNavbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePageNavbar.css';

const HomePageNavbar = () => {
  return (
    <nav className="homepage-navbar">
      <div className="navbar-logo">
        <h1>BukSU Lost and Found</h1>
      </div>
      <div className="navbar-links">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/admin-login">Admin</Link></li>
          <li><Link to="/register">Register</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default HomePageNavbar;
