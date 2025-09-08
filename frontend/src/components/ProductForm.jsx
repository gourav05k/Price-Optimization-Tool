import React, { useState, useEffect } from 'react';
import './ProductForm.css';

const ProductForm = ({ isOpen, onClose, product = null, onSubmit, availableCategories = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    cost_price: '',
    selling_price: '',
    description: '',
    stock_available: '',
    units_sold: ''
  });
  
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = !!product;

  // Initialize form data when product prop changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || '',
        cost_price: product.cost_price || '',
        selling_price: product.selling_price || '',
        description: product.description || '',
        stock_available: product.stock_available || '',
        units_sold: product.units_sold || ''
      });
    } else {
      // Reset form for create mode
      setFormData({
        name: '',
        category: '',
        cost_price: '',
        selling_price: '',
        description: '',
        stock_available: '',
        units_sold: ''
      });
    }
    setErrors({});
  }, [product, isOpen]);
  
  // Update filtered categories when availableCategories or category input changes
  useEffect(() => {
    if (availableCategories.length > 0) {
      if (formData.category === '') {
        // Show all categories when input is empty
        setFilteredCategories(availableCategories);
      } else {
        // Filter categories based on input
        const filtered = availableCategories.filter(cat => 
          cat.toLowerCase().includes(formData.category.toLowerCase())
        );
        setFilteredCategories(filtered);
      }
    } else {
      setFilteredCategories([]);
    }
  }, [availableCategories, formData.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleCategoryInputChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      category: value
    }));
    setShowCategoryDropdown(true);
    
    // Clear error
    if (errors.category) {
      setErrors(prev => ({
        ...prev,
        category: ''
      }));
    }
  };
  
  const selectCategory = (category) => {
    setFormData(prev => ({
      ...prev,
      category
    }));
    setShowCategoryDropdown(false);
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.cost_price || formData.cost_price <= 0) {
      newErrors.cost_price = 'Valid cost price is required';
    }

    if (!formData.selling_price || formData.selling_price <= 0) {
      newErrors.selling_price = 'Valid selling price is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.stock_available || formData.stock_available < 0) {
      newErrors.stock_available = 'Valid stock quantity is required';
    }

    if (!formData.units_sold || formData.units_sold < 0) {
      newErrors.units_sold = 'Valid units sold is required';
    }

    // Business logic validation
    if (formData.cost_price && formData.selling_price && 
        parseFloat(formData.selling_price) <= parseFloat(formData.cost_price)) {
      newErrors.selling_price = 'Selling price must be greater than cost price';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Convert string numbers to floats
      const submitData = {
        ...formData,
        cost_price: parseFloat(formData.cost_price),
        selling_price: parseFloat(formData.selling_price),
        stock_available: parseInt(formData.stock_available),
        units_sold: parseInt(formData.units_sold)
      };

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to save product' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditMode ? 'Edit Product' : 'Create New Product'}
          </h2>
          <button 
            className="modal-close-btn" 
            onClick={handleClose}
            disabled={isLoading}
          >
            ✕
          </button>
        </div>

        <form className="product-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Product Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Enter product name"
                disabled={isLoading}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="category" className="form-label">Category *</label>
              <div className="category-input-container">
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleCategoryInputChange}
                  onFocus={() => setShowCategoryDropdown(true)}
                  onBlur={() => setTimeout(() => setShowCategoryDropdown(false), 200)}
                  className={`form-input ${errors.category ? 'error' : ''}`}
                  placeholder="Enter or select category"
                  disabled={isLoading}
                />
                {showCategoryDropdown && filteredCategories.length > 0 && (
                  <div className="category-dropdown">
                    {filteredCategories.map((category, index) => (
                      <div
                        key={index}
                        className="category-option"
                        onClick={() => selectCategory(category)}
                      >
                        {category}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.category && <span className="error-message">{errors.category}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cost_price" className="form-label">Cost Price ($) *</label>
              <input
                type="number"
                id="cost_price"
                name="cost_price"
                value={formData.cost_price}
                onChange={handleChange}
                className={`form-input ${errors.cost_price ? 'error' : ''}`}
                placeholder="0.00"
                step="0.01"
                min="0"
                disabled={isLoading}
              />
              {errors.cost_price && <span className="error-message">{errors.cost_price}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="selling_price" className="form-label">Selling Price ($) *</label>
              <input
                type="number"
                id="selling_price"
                name="selling_price"
                value={formData.selling_price}
                onChange={handleChange}
                className={`form-input ${errors.selling_price ? 'error' : ''}`}
                placeholder="0.00"
                step="0.01"
                min="0"
                disabled={isLoading}
              />
              {errors.selling_price && <span className="error-message">{errors.selling_price}</span>}
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="description" className="form-label">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`form-textarea ${errors.description ? 'error' : ''}`}
              placeholder="Enter product description"
              rows="3"
              disabled={isLoading}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="stock_available" className="form-label">Stock Quantity *</label>
              <input
                type="number"
                id="stock_available"
                name="stock_available"
                value={formData.stock_available}
                onChange={handleChange}
                className={`form-input ${errors.stock_available ? 'error' : ''}`}
                placeholder="0"
                min="0"
                disabled={isLoading}
              />
              {errors.stock_available && <span className="error-message">{errors.stock_available}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="units_sold" className="form-label">Units Sold *</label>
              <input
                type="number"
                id="units_sold"
                name="units_sold"
                value={formData.units_sold}
                onChange={handleChange}
                className={`form-input ${errors.units_sold ? 'error' : ''}`}
                placeholder="0"
                min="0"
                disabled={isLoading}
              />
              {errors.units_sold && <span className="error-message">{errors.units_sold}</span>}
            </div>
          </div>

          {errors.submit && <div className="submit-error">{errors.submit}</div>}

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : (isEditMode ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
