import React from 'react';
import './Button.css'
import { Link } from 'react-router-dom'

const BtnGreen = ({ to, label, onClick, className, disabled }) => {

   // Determine the button class based on whether it is disabled or not
   const buttonClass = `green-button ${className} ${disabled ? 'disabled-button' : ''}`;

  // If `to` is defined, render a Link component; otherwise, render a regular button
  if (to) {
    return (
      <Link to={to} className={buttonClass}>
        {label}
      </Link>
    );
  } else {
    return (
      <button to={to} className={buttonClass} onClick={onClick} disabled={disabled}>
        {label}
      </button>
    );
  }
  };

  export default BtnGreen;