import React from 'react';
import './ProductDetailModal.css';

const ProductDetailModal = ({ isOpen, onClose, product, onEdit }) => {
  
  const handleClose = () => {
    onClose();
  };

  const handleEdit = () => {
    onClose(); // Close the detail modal first
    setTimeout(() => {
      onEdit(product); // Then open the edit modal after a brief delay
    }, 100);
  };

  if (!isOpen || !product) return null;

  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const formatNumber = (number) => {
    return parseInt(number).toLocaleString();
  };

  const calculateProfitMargin = () => {
    if (product.cost_price && product.selling_price) {
      const margin = ((product.selling_price - product.cost_price) / product.selling_price) * 100;
      return `${margin.toFixed(1)}%`;
    }
    return 'N/A';
  };

  const calculateTotalRevenue = () => {
    if (product.selling_price && product.units_sold) {
      return formatPrice(product.selling_price * product.units_sold);
    }
    return 'N/A';
  };

  return (
    <div className="detail-overlay" onClick={handleClose}>
      <div className="detail-content" onClick={(e) => e.stopPropagation()}>
        <div className="detail-header">
          <div className="detail-title-section">
            <h2 className="detail-title">{product.name}</h2>
            <span className="detail-category">{product.category}</span>
          </div>
          <button 
            className="detail-close-btn" 
            onClick={handleClose}
          >
            ✕
          </button>
        </div>

        <div className="detail-body">
          {/* Basic Information */}
          <div className="detail-section">
            <h3 className="section-title">Product Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label className="detail-label">Product Name</label>
                <span className="detail-value">{product.name}</span>
              </div>
              <div className="detail-item">
                <label className="detail-label">Category</label>
                <span className="detail-value">{product.category}</span>
              </div>
              <div className="detail-item full-width">
                <label className="detail-label">Description</label>
                <span className="detail-value description">{product.description}</span>
              </div>
            </div>
          </div>

          {/* Pricing Information */}
          <div className="detail-section">
            <h3 className="section-title">Pricing Details</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label className="detail-label">Cost Price</label>
                <span className="detail-value price">{formatPrice(product.cost_price)}</span>
              </div>
              <div className="detail-item">
                <label className="detail-label">Selling Price</label>
                <span className="detail-value price selling">{formatPrice(product.selling_price)}</span>
              </div>
              <div className="detail-item">
                <label className="detail-label">Profit Margin</label>
                <span className="detail-value margin">{calculateProfitMargin()}</span>
              </div>
            </div>
          </div>

          {/* Inventory Information */}
          <div className="detail-section">
            <h3 className="section-title">Inventory & Sales</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label className="detail-label">Available Stock</label>
                <span className="detail-value stock">{formatNumber(product.stock_available)}</span>
              </div>
              <div className="detail-item">
                <label className="detail-label">Units Sold</label>
                <span className="detail-value sold">{formatNumber(product.units_sold)}</span>
              </div>
              <div className="detail-item">
                <label className="detail-label">Total Revenue</label>
                <span className="detail-value revenue">{calculateTotalRevenue()}</span>
              </div>
            </div>
          </div>

          {/* Timestamps (if available) */}
          {(product.created_at || product.updated_at) && (
            <div className="detail-section">
              <h3 className="section-title">Timestamps</h3>
              <div className="detail-grid">
                {product.created_at && (
                  <div className="detail-item">
                    <label className="detail-label">Created</label>
                    <span className="detail-value timestamp">
                      {new Date(product.created_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {product.updated_at && (
                  <div className="detail-item">
                    <label className="detail-label">Last Updated</label>
                    <span className="detail-value timestamp">
                      {new Date(product.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="detail-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={handleClose}
          >
            Close
          </button>
          <button 
            type="button" 
            className="btn-primary"
            onClick={handleEdit}
          >
            Edit Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
