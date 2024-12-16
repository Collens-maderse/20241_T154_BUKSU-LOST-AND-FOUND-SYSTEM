import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../components/UserNavbar';
import '../styles/PostItemPage.css';

const PostItemPage = () => {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [postType, setPostType] = useState(''); // New state for post type (Lost or Found)
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setError('');
    setSuccessMessage('');
  
    const formData = new FormData();
    formData.append('image', image);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('postType', postType);
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please log in again.');
      }
  
      const response = await axios.post(
        'http://localhost:5000/api/items',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      setSuccessMessage(response.data.message || 'Item posted successfully!');
      setTimeout(() => navigate('/user-home'), 2000); // Redirect after success
    } catch (error) {
      console.error('Error posting item:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to post the item. Please try again.');
    }
  };
  

  return (
    <div className="PostItemPage">
      <UserNavbar />
      <div className="post-item-page">
        <h2>Post an Item</h2>
        <form onSubmit={handleSubmit} className="post-item-form">
          {error && <p className="error">{error}</p>} {/* Display error message */}
          {successMessage && <p className="success">{successMessage}</p>} {/* Display success message */}

          <label>
            Select Post Type:
            <select
              value={postType}
              onChange={(e) => setPostType(e.target.value)}
              required
            >
              <option value="">Select post type</option>
              <option value="Lost">Lost Item</option>
              <option value="Found">Found Item</option>
            </select>
          </label>

          <label>
            Upload Image:
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              required
            />
          </label>

          <label>
            Description:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a description for the item"
              required
            />
          </label>

          <label>
            Category:
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              <option value="Electronics">Electronics</option>
              <option value="Personal-item">Personal Item</option>
              <option value="ID">ID</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <button type="submit">Post Item</button>
        </form>
      </div>
    </div>
  );
};

export default PostItemPage;
