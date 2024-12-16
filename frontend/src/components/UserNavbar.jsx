// src/components/UserNavbar.jsx

import { Link } from 'react-router-dom';
import '../styles/UserNavbar.css';

const UserNavbar = () => {
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token
    localStorage.removeItem('user'); // Clear user data
    window.location.href = '/login'; // Redirect to login page
  };

  const user = JSON.parse(localStorage.getItem('user')); // Parse user details from localStorage

  return (
    <nav className="user-navbar">
      <div className="navbar-logo">
        <h1>BukSU Lost and Found</h1>
      </div>
      <div className="navbar-links">
        <ul>
          <li><Link to="/user-home">Home</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
          <li><Link to="/profile"><img src="user-icon.png" alt="Profile" /></Link></li>
          <li><a href="/" onClick={handleLogout}>Logout</a></li> {/* Modify logout link */}
        </ul>
      </div>
    </nav>
  );
};

export default UserNavbar;
