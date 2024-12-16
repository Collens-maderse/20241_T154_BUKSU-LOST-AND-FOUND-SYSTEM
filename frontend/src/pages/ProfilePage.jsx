import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import UserNavbar from '../components/UserNavbar';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const [userDetails, setUserDetails] = useState({});
  const [postedItems, setPostedItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]); // Separate state for filtered items
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('All'); // New state for filtering items

  useEffect(() => {
    fetchUserDetails();
    fetchUserPostedItems();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [filterType, postedItems]); // Depend on filterType and postedItems

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please log in again.');
      }
      const response = await axios.get('http://localhost:5000/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserDetails(response.data);
    } catch (err) {
      console.error('Error fetching user details:', err.response?.data || err.message);
      alert('Failed to load your profile details. Please log in again.');
      window.location.href = '/login';
    }
  };

  const fetchUserPostedItems = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please log in again.');
      }
      const response = await axios.get('http://localhost:5000/api/items/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPostedItems(response.data);
      setFilteredItems(response.data); // Show all items initially
    } catch (err) {
      console.error('Error fetching posted items:', err.response?.data || err.message);
      setError('Failed to load your posted items. Please try again.');
    }
  };

  const applyFilter = () => {
    if (filterType === 'All') {
      setFilteredItems(postedItems); // Show all items
    } else {
      const filtered = postedItems.filter((item) => item.postType === filterType);
      setFilteredItems(filtered); // Update filtered items
    }
  };

  const handleFilterChange = (type) => {
    setFilterType(type); // Update the filter type
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete('http://localhost:5000/api/auth/delete-account', {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(response.data.message || 'Your account has been successfully deleted.');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (error) {
      console.error('Error deleting account:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'An error occurred while deleting your account.');
    }
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
            {error && <p className="error">{error}</p>}
            <p>
              <strong>Full Name:</strong> {userDetails.fullname || 'N/A'}
            </p>
            <p>
              <strong>Email:</strong> {userDetails.email || 'N/A'}
            </p>
            <p>
              <strong>User Type:</strong> {userDetails.userType || 'N/A'}
            </p>
            <button className="profile-btn" onClick={() => handleFilterChange('All')}>
              All Items
            </button>
            <button className="profile-btn" onClick={() => handleFilterChange('Lost')}>
              Lost Items
            </button>
            <button className="profile-btn" onClick={() => handleFilterChange('Found')}>
              Found Items
            </button>
            <Link to="/update-account">
              <button className="profile-btn">Update Account</button>
            </Link>
            <button className="profile-btn" onClick={handleLogout}>
              Log-out
            </button>
            <button className="profile-btn delete-btn" onClick={handleDeleteAccount}>
              Delete Account
            </button>
          </div>
        </div>

        {/* Right Content: Displaying Filtered Items */}
        <div className="profile-content">
          <h2>Your Posted Items</h2>
          {error && <p className="error">{error}</p>}
          <div className="posted-items">
            {filteredItems.length === 0 ? (
              <p>No items found for the selected filter.</p>
            ) : (
              filteredItems.map((item) => (
                <div key={item._id} className="posted-item">
                  <img
                    src={`http://localhost:5000/uploads/${item.image}`}
                    alt={item.description}
                    className="item-image"
                  />
                  <p>
                    <strong>Description:</strong> {item.description}
                  </p>
                  <p>
                    <strong>Category:</strong> {item.category}
                  </p>
                  <p>
                    <strong>Post Type:</strong> {item.postType}
                  </p>
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
