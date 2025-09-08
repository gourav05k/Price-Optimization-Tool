import React, { useState } from 'react';
import './RegisterPage.css';

const RegisterPage = ({ onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    } else if (formData.full_name.trim().length < 2) {
      newErrors.full_name = 'Full name must be at least 2 characters';
    } else if (formData.full_name.trim().length > 200) {
      newErrors.full_name = 'Full name is too long (max 200 characters)';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isLoading) {
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({}); // Clear previous errors
    
    try {
      // Simple name splitting
      const firstName = formData.full_name.trim().split(' ')[0];
      const lastName = formData.full_name.trim().split(' ').slice(1).join(' ') || null;

      // Call the register API
      const response = await fetch('http://localhost:8000/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: formData.email.trim(),
          password: formData.password
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Registration successful - redirect to login immediately
        if (onRegister) {
          onRegister(data);
        }
        return; // Exit early on success
      } else {
        const errorData = await response.json();
        
        // Handle specific error cases
        if (response.status === 422) {
          // Validation error
          if (errorData.detail && Array.isArray(errorData.detail)) {
            const fieldErrors = {};
            errorData.detail.forEach(error => {
              const field = error.loc[error.loc.length - 1];
              fieldErrors[field] = error.msg;
            });
            setErrors(fieldErrors);
          } else {
            setErrors({ submit: errorData.detail || 'Validation error. Please check your input.' });
          }
        } else if (response.status === 400) {
          // Bad request (e.g., email already exists)
          setErrors({ submit: errorData.detail || 'Email already registered. Please use a different email.' });
        } else {
          setErrors({ submit: errorData.detail || 'Registration failed. Please try again.' });
        }
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <div className="bcg-logo">
            BCG<span className="x-highlight">X</span>
          </div>
          <h1 className="register-title">Create Account</h1>
          <p className="register-subtitle">Join us to access the Price Optimization Tool.</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="full_name" className="form-label">Full Name</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className={`form-input ${errors.full_name ? 'error' : ''}`}
              placeholder="Enter your full name"
              disabled={isLoading}
            />
            {errors.full_name && <span className="error-message">{errors.full_name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Enter your email"
              disabled={isLoading}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Create a password"
              disabled={isLoading}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Confirm your password"
              disabled={isLoading}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" className="checkbox-input" required />
              <span className="checkbox-text">
                I agree to the <a href="#" className="terms-link">Terms of Service</a> and 
                <a href="#" className="terms-link"> Privacy Policy</a>
              </span>
            </label>
          </div>

          {errors.submit && <div className="submit-error">{errors.submit}</div>}

          <button 
            type="submit" 
            className="register-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="register-footer">
          <p className="signin-prompt">
            Already have an account? 
            <button 
              type="button"
              className="signin-link"
              onClick={onSwitchToLogin}
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
