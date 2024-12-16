import React from 'react';
import '../styles/UserHomePage.css'; // Import custom styles for the page

const UserHome = () => {
  return (
    <div className="user-home">
      <div className="user-home-container">
        <h1>Welcome to Your Homepage!</h1>
        <p className="user-home-description">
          Here you can view your details and manage your account.
        </p>
        <div className="user-home-actions">
          <button className="user-home-button">View Profile</button>
          <button className="user-home-button">Manage Account</button>
        </div>
        {/* Add other content relevant to the user's homepage */}
      </div>
    </div>
  );
};

export default UserHome;
