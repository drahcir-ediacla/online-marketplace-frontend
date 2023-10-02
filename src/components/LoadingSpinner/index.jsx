import React from 'react';
import './style.scss';

function LoadingSpinner() {
  return (
    <div className="loading-spinner-overlay">
      <div className="loading-spinner"></div>
    </div>
  );
}

export default LoadingSpinner;