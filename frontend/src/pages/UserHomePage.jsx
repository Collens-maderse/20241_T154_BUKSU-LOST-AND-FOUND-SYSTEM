import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/UserHomePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faSearch,
  faBell,
  faBookmark,
  faUser,
  faPlus,
  faFilter,
  faList,
  faMobileAlt,
  faIdCard,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';

const UserHomePage = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('All'); // For Lost/Found filter
  const [filterCategory, setFilterCategory] = useState('All'); // For Category filter
  const [bookmarkedItems, setBookmarkedItems] = useState([]);

  useEffect(() => {
    fetchAllItems();
  }, []);

  useEffect(() => {
    fetchAllItems();
  }, []);
  
  const fetchAllItems = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please log in again.');
      }
  
      const response = await axios.get('http://localhost:5000/api/items', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetched Items:', response.data); // Debug log
      setItems(response.data);
    } catch (err) {
      console.error('Error fetching items:', err.response?.data || err.message);
      setError('Failed to fetch items. Please try again.');
    }
  };
  
  

  const handleFilterChange = (type) => {
    setFilterType(type);
    setFilterCategory('All'); // Reset category filter when changing the menu filter
  };

  const handleCategoryChange = (category) => {
    setFilterCategory(category);
    setFilterType('All'); // Reset menu filter when changing the category filter
  };

  const handleLike = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please log in again.');
      }

      const response = await axios.post(
        `http://localhost:5000/api/items/${itemId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { likes, isLiked } = response.data;

      setItems((prevItems) =>
        prevItems.map((item) =>
          item._id === itemId ? { ...item, likes, isLiked } : item
        )
      );
    } catch (err) {
      console.error('Error toggling like:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to toggle like.');
    }
  };

  const handleBookmark = (itemId) => {
    setBookmarkedItems((prevBookmarkedItems) =>
      prevBookmarkedItems.includes(itemId)
        ? prevBookmarkedItems.filter((id) => id !== itemId)
        : [...prevBookmarkedItems, itemId]
    );
  };

  // Filtered items based on the selected filterType and filterCategory
  const filteredItems = items.filter((item) => {
    const matchesType = filterType === 'All' || item.postType === filterType;
    const matchesCategory =
      filterCategory === 'All' || item.category === filterCategory;
    return matchesType && matchesCategory;
  });

  return (
    <div className="user-home">
      {/* Sidebar */}
      <div className="sidebar">
  <h2>Menu</h2>
  <ul>
    <li onClick={() => handleFilterChange('All')}>
      <FontAwesomeIcon icon={faHome} /> Home
    </li>
    <li onClick={() => handleFilterChange('Lost')}>
      <FontAwesomeIcon icon={faSearch} /> Lost
    </li>
    <li onClick={() => handleFilterChange('Found')}>
      <FontAwesomeIcon icon={faList} /> Found
    </li>
    <Link to="/notifications">
      <li>
        <FontAwesomeIcon icon={faBell} /> Notifications
      </li>
    </Link>
    <li>
      <FontAwesomeIcon icon={faBookmark} /> Bookmarks
    </li>
    <Link to="/profile">
      <li>
        <FontAwesomeIcon icon={faUser} /> Profile
      </li>
    </Link>
  </ul>

  {/* Item Category Filter */}
  <h3>
    <FontAwesomeIcon icon={faFilter} /> Filter by Category
  </h3>
  <ul>
    <li onClick={() => handleCategoryChange('All')}>
      <FontAwesomeIcon icon={faList} /> All Categories
    </li>
    <li onClick={() => handleCategoryChange('Electronics')}>
      <FontAwesomeIcon icon={faMobileAlt} /> Electronics
    </li>
    <li onClick={() => handleCategoryChange('Personal-item')}>
      <FontAwesomeIcon icon={faUser} /> Personal Items
    </li>
    <li onClick={() => handleCategoryChange('ID')}>
      <FontAwesomeIcon icon={faIdCard} /> ID
    </li>
    <li onClick={() => handleCategoryChange('Other')}>
      <FontAwesomeIcon icon={faQuestionCircle} /> Other
    </li>
  </ul>

  {/* Post Button */}
  <Link to="/post-item">
    <button className="post-button">
      <FontAwesomeIcon icon={faPlus} /> Post
    </button>
  </Link>
</div>
      {/* Feed Section */}
      <div className="feed">
        <h1>
          {filterType} Items {filterCategory !== 'All' && `- ${filterCategory}`}
        </h1>
        {error && <p className="error">{error}</p>}
        <div className="items-feed">
          {filteredItems.length === 0 ? (
            <p>No items found for this filter.</p>
          ) : (
            filteredItems.map((item) => (
              <div className="item-post" key={item._id}>
            <div className="post-header">
            <strong>
  {item.postedBy
    ? `${item.postedBy.firstname} ${item.postedBy.lastname}`
    : 'Unknown'}
</strong>

  <span> • {new Date(item.createdAt).toLocaleDateString()}</span>
</div>


git branch -M main

                <div className="post-body">
                  {item.image && (
                    <img
                      src={`http://localhost:5000/uploads/${item.image}`}
                      alt={item.description}
                      className="post-image"
                    />
                  )}
                  <p className="post-description">{item.description}</p>
                  <p className="post-category">
                    <strong>Category:</strong> {item.category}
                  </p>
                  <p className="post-type">
                    <strong>Post Type:</strong> {item.postType}
                  </p>
                </div>
                <div className="post-actions">
                  <button
                    className={`like-button ${item.isLiked ? 'liked' : ''}`}
                    onClick={() => handleLike(item._id)}
                  >
                    ❤️ {item.likes}
                  </button>
                  <button
                    className={`bookmark-button ${
                      bookmarkedItems.includes(item._id) ? 'bookmarked' : ''
                    }`}
                    onClick={() => handleBookmark(item._id)}
                  >
                    {bookmarkedItems.includes(item._id) ? '🔖' : '📑'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="right-sidebar">
        <h3>What’s happening</h3>
        <ul>
          <li>#TrendingTopic1</li>
          <li>#TrendingTopic2</li>
          <li>#TrendingTopic3</li>
        </ul>
        <h3>Who to follow</h3>
        <ul>
          <li>John Doe</li>
          <li>Jane Smith</li>
          <li>Example User</li>
        </ul>
      </div>
    </div>
  );
};

export default UserHomePage;
