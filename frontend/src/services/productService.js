// Product API Service
const API_BASE_URL = 'http://localhost:8000/api/v1';

class ProductService {
  // Get authentication headers (when auth is re-enabled)
  static getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Handle API responses
  static async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || error.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  // Get all products with optional search and filters
  static async getProducts(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);
    if (params.min_price) queryParams.append('min_price', params.min_price);
    if (params.max_price) queryParams.append('max_price', params.max_price);
    if (params.page) queryParams.append('page', params.page);
    if (params.size) queryParams.append('size', params.size);

    const url = `${API_BASE_URL}/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Get single product by ID
  static async getProduct(productId) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  // Create new product
  static async createProduct(productData) {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(productData),
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // Update existing product
  static async updateProduct(productId, productData) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(productData),
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // Delete product
  static async deleteProduct(productId) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      
      if (response.status === 204) {
        return { success: true };
      }
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // Get product categories
  static async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/products/categories`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Bulk update product prices
  static async bulkUpdatePrices(updates) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/bulk-update-prices`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ updates }),
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error bulk updating prices:', error);
      throw error;
    }
  }

  // Search products (advanced search)
  static async searchProducts(searchCriteria) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/search`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(searchCriteria),
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }
}

export default ProductService;
