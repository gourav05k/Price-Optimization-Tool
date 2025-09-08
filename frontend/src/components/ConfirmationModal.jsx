import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger", // 'danger', 'warning', 'info'
  isLoading = false
}) => {

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const getIconByType = () => {
    switch (type) {
      case 'danger':
        return '🗑️';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '❓';
    }
  };

  return (
    <div className="confirmation-overlay" onClick={handleClose}>
      <div className="confirmation-content" onClick={(e) => e.stopPropagation()}>
        <div className="confirmation-header">
          <div className={`confirmation-icon ${type}`}>
            {getIconByType()}
          </div>
          <h3 className="confirmation-title">{title}</h3>
        </div>

        <div className="confirmation-body">
          <p className="confirmation-message">{message}</p>
        </div>

        <div className="confirmation-actions">
          <button 
            type="button"
            className="btn-cancel"
            onClick={handleClose}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button 
            type="button"
            className={`btn-confirm ${type}`}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
