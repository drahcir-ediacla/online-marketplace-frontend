import React from 'react';
import './Button.css'

const BtnGreen = ({ label, onClick, className }) => {
  return (
    <button className={`green-button ${className}`} onClick={onClick}>
      {label}
    </button>
  );
};

export default BtnGreen;