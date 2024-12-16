import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Notification.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please log in again.');
      }

      const response = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(response.data);
    } catch (err) {
      console.error('Error fetching notifications:', err.response?.data || err.message);
      setError('Failed to fetch notifications. Please try again.');
    }
  };

  return (
    <div className="notifications-page">
      <h1>Notifications</h1>
      {error && <p className="error">{error}</p>}
      <div className="notification-list">
        {notifications.length === 0 ? (
          <p>No notifications yet.</p>
        ) : (
          notifications.map((notification) => (
            <div className="notification" key={notification._id}>
              <p>
                {notification.sender
                  ? `${notification.sender.firstname} ${notification.sender.lastname}`
                  : 'Unknown User'}{' '}
                liked your item "{notification.item?.description || 'Unknown Item'}".
              </p>
              <span>{new Date(notification.createdAt).toLocaleString()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
