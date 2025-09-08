import React, { useState, useEffect, useCallback, useRef } from 'react';
import ProductForm from './ProductForm';
import ConfirmationModal from './ConfirmationModal';
import ProductDetailModal from './ProductDetailModal';
import DemandForecastModal from './DemandForecastModal';
import ProductService from '../services/productService';
import DemandForecastService from '../services/demandForecastService';
import PricingOptimizationService from '../services/pricingOptimizationService';
import './ProductTable.css';

const ProductTable = ({ onAddProductFromNavbar, shouldOpenCreateModal, searchTerm: externalSearchTerm, selectedCategory: externalSelectedCategory, onSearchChange, onCategoryChange, categories: externalCategories = [], onCategoriesUpdate, showDemandForecast = false, showOptimizedPrice = false, onDemandForecastToggle, demandForecastTrigger, showActions = true, showCheckboxes = true }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDemandForecastOpen, setIsDemandForecastOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);

  // Search and filter states - use external props if provided, otherwise internal state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  
  // Use external categories if provided, otherwise use internal state
  const currentCategories = externalCategories.length > 0 ? externalCategories : categories;
  
  // Use external search/category if provided, otherwise use internal state
  const currentSearchTerm = externalSearchTerm !== undefined ? externalSearchTerm : searchTerm;
  const currentSelectedCategory = externalSelectedCategory !== undefined ? externalSelectedCategory : selectedCategory;
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [pageSize] = useState(10);

  // Load products on component mount
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const searchParams = {
        search: currentSearchTerm || undefined,  // Don't send empty string
        category: currentSelectedCategory || undefined,  // Don't send empty string
        ...params,
        page: params.page || currentPage,  // Use params.page if provided, otherwise currentPage
        size: pageSize
      };
      
      const response = await ProductService.getProducts(searchParams);
      
      if (response.products) {
        setProducts(response.products);
        setTotalProducts(response.total);
        setTotalPages(Math.ceil(response.total / pageSize));
      } else {
        setProducts(response || []);
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to load products:', err);
      // Use fallback data if API fails
      setProducts(getFallbackProducts());
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await ProductService.getCategories();
      const newCategories = response.categories || response || [];
      
      // Update internal state
      setCategories(newCategories);
      
      // Notify parent component if external categories are being used
      if (onCategoriesUpdate) {
        onCategoriesUpdate(newCategories);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
      // Use empty array if API fails
      const emptyCategories = [];
      setCategories(emptyCategories);
      
      if (onCategoriesUpdate) {
        onCategoriesUpdate(emptyCategories);
      }
    }
  };

  // Search and filter effects
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadProducts();
    }, 300); // Debounce search
    
    return () => clearTimeout(timeoutId);
  }, [currentSearchTerm, currentSelectedCategory, currentPage]);

  // Fallback data if API fails
  const getFallbackProducts = () => [
    {
      id: 1,
      name: "Gio - Note Pad",
      category: "Stationary",
      cost_price: 1.2,
      selling_price: 2.7,
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod laboris labore.",
      stock_available: 121213,
      units_sold: 131244
    },
    {
      id: 2,
      name: "Jazz - Sticky Notes",
      category: "Stationary", 
      cost_price: 2.5,
      selling_price: 3.3,
      description: "Sed do eiusmod tempor incididunt.",
      stock_available: 21200,
      units_sold: 653121
    }
  ];

  // CRUD Operations
  const handleCreateProduct = async (productData) => {
    try {
      await ProductService.createProduct(productData);
      
      // Refresh categories to include any new category that was added
      await loadCategories();
      
      // Go to page 1 to show the newly created product (sorted by newest first)
      setCurrentPage(1);
      
      // Refresh the product list to show the new product immediately
      await loadProducts({ page: 1 });
      
      setIsProductFormOpen(false);
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const handleUpdateProduct = async (productData) => {
    try {
      await ProductService.updateProduct(editingProduct.id, productData);
      await loadProducts();
      setIsProductFormOpen(false);
      setEditingProduct(null);
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await ProductService.deleteProduct(deletingProduct.id);
      await loadProducts();
      setIsDeleteModalOpen(false);
      setDeletingProduct(null);
      setSelectedProducts(prev => prev.filter(id => id !== deletingProduct.id));
    } catch (err) {
      console.error('Failed to delete product:', err);
      throw new Error(err.message);
    }
  };

  // Modal handlers
  const openCreateModal = useCallback(() => {
    setEditingProduct(null);
    setIsProductFormOpen(true);
  }, []);

  // Listen for external trigger to open create modal
  useEffect(() => {
    if (shouldOpenCreateModal) {
      openCreateModal();
    }
  }, [shouldOpenCreateModal, openCreateModal]);

  // Listen for external trigger to open demand forecast modal
  useEffect(() => {
    if (demandForecastTrigger) {
      openDemandForecastModal();
    }
  }, [demandForecastTrigger]);

  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsProductFormOpen(true);
  };

  const openDeleteModal = (product) => {
    setDeletingProduct(product);
    setIsDeleteModalOpen(true);
  };

  const openDetailModal = (product) => {
    setViewingProduct(product);
    setIsDetailModalOpen(true);
  };

  const closeModals = () => {
    setIsProductFormOpen(false);
    setIsDeleteModalOpen(false);
    setIsDetailModalOpen(false);
    setIsDemandForecastOpen(false);
    setEditingProduct(null);
    setDeletingProduct(null);
    setViewingProduct(null);
  };

  const openDemandForecastModal = () => {
    if (selectedProducts.length === 0) {
      alert('Please select at least one product to view demand forecast.');
      return;
    }
    setIsDemandForecastOpen(true);
  };

  const getSelectedProductsData = () => {
    return products.filter(product => selectedProducts.includes(product.id));
  };

  // Selection handlers
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(product => product.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  // Search and filter handlers - call external handlers if provided
  const handleSearchChange = (e) => {
    const value = e.target.value;
    if (onSearchChange) {
      onSearchChange(value);
    } else {
      setSearchTerm(value);
    }
    // Reset to page 1 when searching
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (onCategoryChange) {
      onCategoryChange(value);
    } else {
      setSelectedCategory(value);
    }
    // Reset to page 1 when filtering
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="product-table-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-table-container">
      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={() => loadProducts()} className="retry-btn">Retry</button>
        </div>
      )}

      <div className="table-wrapper">
        <table className="product-table">
          <thead>
            <tr>
              {showCheckboxes && (
                <th className="checkbox-column">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="table-checkbox"
                  />
                </th>
              )}
              <th>Product Name</th>
              <th>Product Category</th>
              <th>Cost Price</th>
              <th>Selling Price</th>
              <th>Description</th>
              <th>Available Stock</th>
              <th>Units Sold</th>
              {showDemandForecast && <th>Calculated Demand Forecast</th>}
              {showOptimizedPrice && <th>Optimized Price</th>}
              {showActions && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className={selectedProducts.includes(product.id) ? 'selected' : ''}>
                {showCheckboxes && (
                  <td className="checkbox-column">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                      className="table-checkbox"
                    />
                  </td>
                )}
                <td className="product-name">{product.name}</td>
                <td>{product.category}</td>
                <td className="price-column">$ {product.cost_price}</td>
                <td className="price-column">$ {product.selling_price}</td>
                <td className="description-column">{product.description}</td>
                <td className="stock-column">{product.stock_available?.toLocaleString()}</td>
                <td className="stock-column">{product.units_sold?.toLocaleString()}</td>
                {showDemandForecast && (
                  <td className="forecast-column">
                    {DemandForecastService.calculateDemandForecast(product).toLocaleString()}
                  </td>
                )}
                {showOptimizedPrice && (
                  <td className="optimized-price-column">
                    $ {PricingOptimizationService.calculateOptimizedPrice(product)}
                  </td>
                )}
                {showActions && (
                  <td className="action-column">
                    <div className="action-buttons">
                      <button 
                        className="action-btn view-btn" 
                        title="View Details"
                        onClick={() => openDetailModal(product)}
                      >
                        👁️
                      </button>
                      <button 
                        className="action-btn edit-btn" 
                        title="Edit Product"
                        onClick={() => openEditModal(product)}
                      >
                        ✏️
                      </button>
                      <button 
                        className="action-btn delete-btn" 
                        title="Delete Product"
                        onClick={() => openDeleteModal(product)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && !loading && (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No products found</h3>
            <p>Get started by creating your first product.</p>
            <button className="btn-primary" onClick={openCreateModal}>
              Create Product
            </button>
          </div>
        )}
      </div>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalProducts)} of {totalProducts} products
          </div>
          <div className="pagination-controls">
            <button 
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
            >
              First
            </button>
            <button 
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            
            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const startPage = Math.max(1, currentPage - 2);
              const pageNum = startPage + i;
              if (pageNum <= totalPages) {
                return (
                  <button
                    key={pageNum}
                    className={`pagination-btn ${pageNum === currentPage ? 'active' : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              }
              return null;
            })}
            
            <button 
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
            <button 
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
            >
              Last
            </button>
          </div>
        </div>
      )}

              {/* Bottom Action Bar */}
        <div className="table-actions">
          <div className="selected-info">
            {selectedProducts.length > 0 && (
              <span>{selectedProducts.length} product(s) selected</span>
            )}
          </div>
          <div className="action-buttons-right">
            <button className="cancel-btn">Cancel</button>
            <button className="save-btn">Save</button>
          </div>
        </div>

      {/* Modals */}
      <ProductForm
        isOpen={isProductFormOpen}
        onClose={closeModals}
        product={editingProduct}
        onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
        availableCategories={currentCategories}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeModals}
        onConfirm={handleDeleteProduct}
        title="Delete Product"
        message={`Are you sure you want to delete "${deletingProduct?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />

      <ProductDetailModal
        isOpen={isDetailModalOpen}
        onClose={closeModals}
        product={viewingProduct}
        onEdit={openEditModal}
      />

      <DemandForecastModal
        isOpen={isDemandForecastOpen}
        onClose={closeModals}
        selectedProducts={getSelectedProductsData()}
      />
    </div>
  );
};

export default ProductTable;