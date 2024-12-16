import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import UserNavbar from './components/UserNavbar';
import HomePageNavbar from './components/HomePageNavbar';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import ProfilePage from './pages/ProfilePage';
import Register from './pages/Register';
import UserHomePage from './pages/UserHomePage';
import ProtectedRoute from './components/ProtectedRoute';
import PostItemPage from './pages/PostItemPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard'
import Notifications from './pages/Notification';
import ContactUs from "./pages/ContactUs";


import './App.css';

function App() {
  // Retrieve userType from localStorage or context
  const token = localStorage.getItem('token');
  let userType = null;

  if (token) {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT to get user data
      userType = decodedToken.userType;
    } catch (e) {
      console.error('Invalid token:', e);
    }
  }

  return (
    <GoogleOAuthProvider clientId="475680109157-79nfok0c0hfhilhddhljp3jk1jqh02vc.apps.googleusercontent.com">
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<><HomePageNavbar /><Home /></>} />
            <Route path="/about" element={<><UserNavbar /><About /></>} />
            <Route path="/login" element={<><HomePageNavbar /><Login /></>} />
            <Route path="/register" element={<><HomePageNavbar /><Register /></>} />
            <Route path="/post-item" element={<PostItemPage />} />
            <Route path="/contact" element={<><UserNavbar /><ContactUs /></>} />
            <Route path="/notifications" element={<><UserNavbar /><ProtectedRoute element={<Notifications />} /></>} />
          
            {/* Admin Route - Login and Admin Page */}
          <Route path="/admin-login" element={<><HomePageNavbar /><AdminLogin /></>} />
          <Route path="/admin" element={<AdminDashboard />} /> {/* Redirect to Admin Page on successful login */}
            
            {/* Admin Route - Protected */}
            <Route 
              path="/admin-login" 
              element={<AdminDashboard />}
               />

               <Route
                path='/admin'
                element = {userType=== 'admin' ? <AdminDashboard /> : <Navigate to="/admin-login" />}
                />

            {/* Protected Routes */}
            <Route 
              path="/user-home" 
              element={<><UserNavbar /><ProtectedRoute element={<UserHomePage />} /></>} 
            />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
