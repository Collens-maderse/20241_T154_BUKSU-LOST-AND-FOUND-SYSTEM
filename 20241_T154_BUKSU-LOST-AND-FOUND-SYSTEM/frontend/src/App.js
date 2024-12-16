import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserNavbar from './components/UserNavbar';  // Import the user navbar (same navbar for About and UserHome)
import HomePageNavbar from './components/HomePageNavbar';  // Import the homepage navbar
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import ProfilePage from './pages/ProfilePage';  // Import the profile page
import Register from './pages/Register';
import UserHomePage from './pages/UserHomePage';  // Import UserHomePage
import ProtectedRoute from './components/ProtectedRoute';  // ProtectedRoute for login-check
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<><HomePageNavbar /><Home /></>} />
          <Route path="/about" element={<><UserNavbar /><About /></>} /> {/* Updated to use UserNavbar */}
          <Route path="/login" element={<><HomePageNavbar /><Login /></>} />
          <Route path="/register" element={<><HomePageNavbar /><Register /></>} />
          
          {/* Protected Routes */}
          <Route 
            path="/user-home" 
            element={<><UserNavbar /><ProtectedRoute element={<UserHomePage />} /></>} 
            
          />
           <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
