import React from 'react';
import './Button.css'
import {Link} from 'react-router-dom'

const BtnClear = ({ to, label, onClick, className, disabled, type }) => {

  // If `to` is defined, render a Link component; otherwise, render a regular button
  if (to) {
    return (
      <Link to={to} className={`clear-button ${className}`}>
        {label}
      </Link>
    );
  } else {
  return (
    <button type={type} to={to} className={`clear-button ${className}`} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
  }
};

export default BtnClear;