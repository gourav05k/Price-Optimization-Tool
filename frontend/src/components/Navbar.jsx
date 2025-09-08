import React from 'react';
import './Navbar.css';

const Navbar = ({ user, onLogout, pageType = "products", onAddProduct, onBack, searchTerm, selectedCategory, onSearchChange, onCategoryChange, categories = [], onDemandForecast, withDemandForecast = false, onDemandForecastToggle }) => {
  return (
    <div className="navbar">
      {/* Top Row: Title and User Info */}
      <div className="navbar-header">
        <div className="app-title">Price Optimization Tool</div>
        <div className="user-section">
          <span className="welcome-text">Welcome, {user?.first_name || 'Guest'}</span>
          <div 
            className={`user-avatar ${user?.first_name === 'Guest' ? 'guest' : ''}`}
            onClick={onLogout} 
            title={user?.first_name === 'Guest' ? 'Click to go back' : 'Click to logout'}
          >
            {user?.first_name?.charAt(0).toUpperCase() || 'G'}
          </div>
        </div>
      </div>

      {/* Second Row: Navigation and Actions */}
      <div className="navbar-controls">
        <div className="left-controls">
          <button className="back-btn" onClick={onBack}>← Back</button>
          <div className="page-title">
            {pageType === "products" ? "Create and Manage Product" : "Pricing Optimization"}
          </div>
        </div>
        
        <div className="center-controls">
          {(pageType === "products" || pageType === "pricing") && (
            <div className="demand-forecast-toggle">
              <span className="toggle-label">With Demand Forecast</span>
              <div 
                className={`toggle-switch ${withDemandForecast ? 'active' : ''}`}
                onClick={onDemandForecastToggle}
              ></div>
            </div>
          )}
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search..." 
              className="search-input"
              value={searchTerm || ''}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            />
          </div>
          <div className="filter-section">
            <label className="filter-label">Category:</label>
            <select 
              className="category-select"
              value={selectedCategory || ''}
              onChange={(e) => onCategoryChange && onCategoryChange(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
            <button className="filter-btn">🔽 Filter</button>
          </div>
        </div>
        
        <div className="right-controls">
          {pageType === "products" && (
            <>
              <button className="add-products-btn" onClick={onAddProduct}>+ Add New Products</button>
              <button className="demand-forecast-btn" onClick={onDemandForecast}>📊 Demand Forecast</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
