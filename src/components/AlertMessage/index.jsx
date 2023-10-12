import React, { useState, useEffect } from 'react';
import './style.scss';

const AlertMessage = ({ type, message }) => {
  const [showClass, setShowClass] = useState(true); // Add state for the 'show' class

  useEffect(() => {
    if (showClass) {
      const timer = setTimeout(() => {
        setShowClass(false); // Hide the 'show' class after 3 seconds
      }, 3000); // 3000 milliseconds = 3 seconds

      return () => clearTimeout(timer);
    }
  }, [showClass]);

  return (
    <div className="alert-container">
      <div className={`alert ${type} ${showClass ? 'show' : ''}`}>
        {message}
      </div>
    </div>
  );
};

export default AlertMessage;
