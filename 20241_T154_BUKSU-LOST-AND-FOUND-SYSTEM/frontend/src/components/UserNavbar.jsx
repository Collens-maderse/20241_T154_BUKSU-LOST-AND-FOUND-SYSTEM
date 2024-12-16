// src/components/UserNavbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/UserNavbar.css';

const UserNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const categories = ['Electronics Devices', 'Personal Items', 'IDs', 'Other'];

  const handleMouseEnter = () => {
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    // Perform the logout logic here (clear user session, etc.)
    localStorage.removeItem('user'); // For example, remove user data
    window.location.href = '/login';  // Redirect to login page
  };

  return (
    <nav className="user-navbar">
      <div className="navbar-logo">
        <h1>BukSU Lost and Found</h1>
      </div>
      <div className="navbar-links">
        <ul>
          <li><Link to="/user-home">Home</Link></li>
          
          {/* Dropdown for Categories */}
          <li 
            className="dropdown" 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
          >
            <span>Item Categories</span>
            {dropdownOpen && (
              <ul className="dropdown-menu">
                {categories.map((category, index) => (
                  <li key={index}>
                    <Link to={`/category/${category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}>
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
          
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
          <li><Link to="/profile"><img src="user-icon.png" alt="Profile" /></Link></li>
          <li><a href="#" onClick={handleLogout}>Logout</a></li> {/* Modify logout link */}
        </ul>
      </div>
    </nav>
  );
};

export default UserNavbar;
