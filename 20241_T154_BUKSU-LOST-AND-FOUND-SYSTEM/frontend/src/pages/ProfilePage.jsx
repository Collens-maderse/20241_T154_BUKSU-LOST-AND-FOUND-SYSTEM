import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import UserNavbar from '../components/UserNavbar';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  // Dummy data, replace with real user data from your authentication system
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const [postedItems] = useState([
    
  ]);

  const handleLogout = () => {
    // Perform logout actions like clearing session or token
    localStorage.removeItem('user');
    window.location.href = '/login';  // Redirect to login
  };

  const handleDeleteAccount = () => {
    // Handle account deletion (this is just a simulation)
    alert('Your account has been deleted.');
    localStorage.removeItem('user');
    window.location.href = '/login';  // Redirect to login after account deletion
  };

  return (
    <div className="profile-page">
      <UserNavbar />
      <div className="profile-container">
        {/* Left Sidebar */}
        <div className="profile-sidebar">
          <div className="profile-icon">
            <img src="profile-icon.png" alt="Profile" />
          </div>
          <div className="user-info">
            <p><strong>Username:</strong> {user.email}</p>
            <p><strong>User Type:</strong> {user.userType}</p>
            <Link to="/posted-items">
              <button className="profile-btn">Posted Items</button>
            </Link>
            <Link to="/post-item">
              <button className="profile-btn">Post an Item</button>
            </Link>
            <Link to="/update-account">
              <button className="profile-btn">Update Account</button>
            </Link>
            <button className="profile-btn" onClick={handleLogout}>Log-out</button>
            <button className="profile-btn delete-btn" onClick={handleDeleteAccount}>Delete Account</button>
          </div>
        </div>

        {/* Right Content: Displaying Posted Items */}
        <div className="profile-content">
          <h2>Your Posted Items</h2>
          <div className="posted-items">
            {postedItems.length === 0 ? (
              <p>No posted items found.</p>
            ) : (
              postedItems.map(item => (
                <div key={item.id} className="posted-item">
                  <p>{item.title}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
