import React from 'react';
import './Button.css'

const BtnClear = ({ label, onClick, className }) => {
  return (
    <button className={`clear-button ${className}`} onClick={onClick}>
      {label}
    </button>
  );
};

export default BtnClear;