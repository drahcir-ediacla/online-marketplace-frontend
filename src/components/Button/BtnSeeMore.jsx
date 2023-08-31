import React from 'react';
import './Button.css'

const BtnSeeMore = ({ label, onClick, className }) => {
  return (
    <button className={`seemore-button ${className}`} onClick={onClick}>
      {label}
    </button>
  );
};

export default BtnSeeMore;