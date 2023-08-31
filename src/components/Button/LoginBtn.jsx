import React from 'react';
import './Button.css'

const LoginBtn = ({ label, onClick, className, IconclassName, icon }) => {
  return (
    <button className={`custom-login-button ${className}`} onClick={onClick}>
      <div className={`svg-class ${IconclassName}`}>{icon}</div><span>{label}</span>
    </button>
  );
};

export default LoginBtn;