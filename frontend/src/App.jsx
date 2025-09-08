import React, { useState, useEffect ,useRef } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar';
import ProductTable from './components/ProductTable';
import PricingTable from './components/PricingTable';
import './App.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#1a202c',
        color: 'white'
      }}>
        <div>Loading...</div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <AuthFlow onLoginSuccess={() => {}} />;
};

// Authentication flow component
const AuthFlow = ({ onLoginSuccess }) => {
  const [currentView, setCurrentView] = useState('login'); // 'login' or 'register'
  const { login, register } = useAuth();

  const handleLogin = async (data) => {
    const result = await login(data);
    if (result.success) {
      console.log('Login successful');
      // After successful login, redirect to landing page
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    }
  };

  const handleRegister = async (data) => {
    // Registration was already successful in RegisterPage
    // No need to call API again, just update UI
    console.log('Registration successful, switching to login');
    setCurrentView('login');
  };

  if (currentView === 'register') {
    return (
      <RegisterPage
        onRegister={handleRegister}
        onSwitchToLogin={() => setCurrentView('login')}
      />
    );
  }

  return (
    <LoginPage
      onLogin={handleLogin}
      onSwitchToRegister={() => setCurrentView('register')}
    />
  );
};

// Main App content
const AppContent = () => {
  
  const [currentPage, setCurrentPage] = useState('landing');
  
  // Get actual auth state 
  const { user: authUser, isAuthenticated } = useAuth();
  
  // Determine user display based on auth state
  const getDisplayUser = () => {
    if (isAuthenticated && authUser) {
      return {
        first_name: authUser.first_name || 'User',
        full_name: `${authUser.first_name || ''} ${authUser.last_name || ''}`.trim() || 'User'
      };
    }
    return {
      first_name: 'Guest',
      full_name: 'Guest'
    };
  };
  
  const displayUser = getDisplayUser();
  
  // State to trigger create modal from navbar
  const [shouldOpenCreateModal, setShouldOpenCreateModal] = useState(false);
  
  // Filter states for products page
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [withDemandForecast, setWithDemandForecast] = useState(false);
  


  // Handle navigation from landing page - SHOULD GO TO LOGIN
  const handleGetStarted = () => {
    setCurrentPage('auth'); // Go to login page instead of directly to products
  };

  // Handle card navigation - SKIP AUTH CHECK  
  const handleNavigateToProducts = () => {
    setCurrentPage('products');
    // Reset demand forecast toggle when navigating to products page
    setWithDemandForecast(false);
  };

  const handleNavigateToPricing = () => {
    setCurrentPage('pricing');
    // Reset demand forecast toggle when navigating to pricing page
    setWithDemandForecast(false);
  };

  // Handle logout - MOCK FUNCTION
  const handleLogout = () => {
    setCurrentPage('landing');
  };

  // Handle add product from navbar
  const handleAddProduct = () => {
    setShouldOpenCreateModal(true);
    // Reset the trigger after a short delay
    setTimeout(() => setShouldOpenCreateModal(false), 100);
  };

  const [demandForecastTrigger, setDemandForecastTrigger] = useState(false);

  const handleDemandForecast = () => {
    // Trigger demand forecast modal from navbar
    setDemandForecastTrigger(true);
    setTimeout(() => setDemandForecastTrigger(false), 100);
  };

  const handleDemandForecastToggle = () => {
    setWithDemandForecast(!withDemandForecast);
  };

  // Handle back button - go to landing page
  const handleBack = () => {
    setCurrentPage('landing');
  };

  // Handle successful login
  const handleLoginSuccess = () => {
    setCurrentPage('landing');
  };

  // Render based on current page - SKIP AUTH CHECKS
  if (currentPage === 'auth') {
    return <AuthFlow onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentPage === 'products') {
    return (
      <ProtectedRoute>
        <div className="App">
          <Navbar 
            user={displayUser} 
            onLogout={handleLogout} 
            pageType="products" 
            onAddProduct={handleAddProduct} 
            onBack={handleBack}
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            onSearchChange={setSearchTerm}
            onCategoryChange={setSelectedCategory}
            categories={categories}
            onDemandForecast={handleDemandForecast}
            withDemandForecast={withDemandForecast}
            onDemandForecastToggle={handleDemandForecastToggle}
          />
          <div style={{ backgroundColor: '#1a202c', minHeight: '100vh' }}>
            <ProductTable 
              shouldOpenCreateModal={shouldOpenCreateModal}
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              onSearchChange={setSearchTerm}
              onCategoryChange={setSelectedCategory}
              categories={categories}
              onCategoriesUpdate={setCategories}
              showDemandForecast={withDemandForecast}
              showOptimizedPrice={false}
              showActions={true}
              showCheckboxes={true}
              onDemandForecastToggle={handleDemandForecastToggle}
              demandForecastTrigger={demandForecastTrigger}
            />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (currentPage === 'pricing') {
    return (
      <ProtectedRoute>
        <div className="App">
          <Navbar 
            user={displayUser} 
            onLogout={handleLogout} 
            pageType="pricing" 
            onBack={handleBack}
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            onSearchChange={setSearchTerm}
            onCategoryChange={setSelectedCategory}
            categories={categories}
            withDemandForecast={withDemandForecast}
            onDemandForecastToggle={handleDemandForecastToggle}
          />
          <div style={{ backgroundColor: '#1a202c', minHeight: '100vh' }}>
            <PricingTable 
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              onSearchChange={setSearchTerm}
              onCategoryChange={setSelectedCategory}
              categories={categories}
              onCategoriesUpdate={setCategories}
              withDemandForecast={withDemandForecast}
              onDemandForecastToggle={handleDemandForecastToggle}
              demandForecastTrigger={demandForecastTrigger}
            />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Default to landing page
  return (
    <div className="App">
      <LandingPage 
        onGetStarted={handleGetStarted}
        onNavigateToProducts={handleNavigateToProducts}
        onNavigateToPricing={handleNavigateToPricing}
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
