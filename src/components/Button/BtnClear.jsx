import React from 'react';
import './Button.css'

const BtnClear = ({ label, onClick, className, disabled }) => {
  return (
    <button className={`clear-button ${className}`} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

export default BtnClear;