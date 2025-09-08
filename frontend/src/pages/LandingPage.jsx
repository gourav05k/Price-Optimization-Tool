import React from 'react';
import './LandingPage.css';

const LandingPage = ({ onGetStarted, onNavigateToProducts, onNavigateToPricing }) => {
  return (
    <div className="landing-page">
      {/* Header Section */}
      <div className="header-section">
        <div className="bcg-logo">
          <span className="bcg-text">BCG</span><span className="x-highlight">X</span>
        </div>
        <h1 className="main-title">Price Optimization Tool</h1>
        <p className="subtitle">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <button className="get-started-btn" onClick={onGetStarted}>Get Started</button>
      </div>

      {/* Feature Cards Section */}
      <div className="cards-section">
        <div className="feature-card" onClick={onNavigateToProducts}>
          <div className="card-icon">
            📦
          </div>
          <h3 className="card-title">Create and Manage Product</h3>
          <p className="card-description">
            Ability to create, view, update, and delete products. Implement robust search and filter capabilities.
          </p>
          <div className="card-arrow">→</div>
        </div>

        <div className="feature-card" onClick={onNavigateToPricing}>
          <div className="card-icon">
            📊
          </div>
          <h3 className="card-title">Pricing Optimization</h3>
          <p className="card-description">
            Determine the best product prices based on demand forecasts and market conditions. Visualize demand trajectory.
          </p>
          <div className="card-arrow">→</div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;