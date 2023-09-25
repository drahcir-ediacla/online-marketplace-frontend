import React from 'react';
import './Button.css'
import { Link } from 'react-router-dom'

const BtnGreen = ({ to, label, onClick, className }) => {

  // If `to` is defined, render a Link component; otherwise, render a regular button
  if (to) {
    return (
      <Link to={to} className={`green-button ${className}`}>
        {label}
      </Link>
    );
  } else {
    return (
      <button to={to} className={`green-button ${className}`} onClick={onClick}>
        {label}
      </button>
    );
  }
  };

  export default BtnGreen;