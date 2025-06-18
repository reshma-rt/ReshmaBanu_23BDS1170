import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">🎉 Welcome to EventMaster</h1>
        <p className="home-subtitle">Your all-in-one Event Tracking & Management System</p>
        <div className="home-buttons">
          <Link to="/signup" className="home-btn">Sign Up</Link>
          <Link to="/login" className="home-btn">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
