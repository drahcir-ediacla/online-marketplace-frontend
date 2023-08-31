import React from 'react';
import './Button.css'

const BtnCategory = ({ label, onClick, className }) => {
  return (
    <button className={`category-button ${className}`} onClick={onClick}>
      {label}
    </button>
  );
};

export default BtnCategory;