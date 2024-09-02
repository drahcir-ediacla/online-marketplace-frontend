import React from 'react';
import './Button.css'

const BtnCategory = ({ label, onClick, className, active }) => {
  return (
    <button className={`category-button ${active ? 'active' : ''} ${className}`} onClick={onClick} >
      {label}
    </button>
  );
};

export default BtnCategory;