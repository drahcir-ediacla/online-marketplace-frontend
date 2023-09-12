import React from 'react';
import './Button.css'

const LoginBtn = ({ label, onClick, className, IconclassName, icon, disabled, type, id }) => {
  return (
    <button className={`custom-login-button ${className}`} onClick={onClick} disabled={disabled} type={type} id={id}>
      <div className={`svg-class ${IconclassName}`}>{icon}</div><span>{label}</span>
    </button>
  );
};

export default LoginBtn;