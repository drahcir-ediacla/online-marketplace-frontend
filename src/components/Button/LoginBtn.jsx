import React from 'react';
import './Button.css'

const LoginBtn = ({ label, onClick, className, IconclassName, icon, disabled, type }) => {
  return (
    <button className={`custom-login-button ${className}`} onClick={onClick} disabled={disabled} type={type}>
      <div className={`svg-class ${IconclassName}`}>{icon}</div><span>{label}</span>
    </button>
  );
};

export default LoginBtn;