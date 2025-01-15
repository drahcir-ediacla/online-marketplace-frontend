import React, { useState, useEffect, useRef } from 'react';
import './style.scss';

const AlertMessage = ({ type, message, className }) => {
  const [showClass, setShowClass] = useState(true); // Add state for the 'show' class
  const alertBox = useRef(null)

  useEffect(() => {
    const handleGlobalClick = (e) => {
      if (alertBox.current && !alertBox.current.contains(e.target)) {
        setShowClass(false)
      }
    }
    document.addEventListener('click', handleGlobalClick);

    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [])

  const toggleShowClass = () => {
    setShowClass((prev) => !prev)
  }

  // useEffect(() => {
  //   if (showClass) {
  //     const timer = setTimeout(() => {
  //       setShowClass(false); // Hide the 'show' class after 3 seconds
  //     }, 3000); // 3000 milliseconds = 3 seconds

  //     return () => clearTimeout(timer);
  //   }
  // }, [showClass]);

  return (
    <div className={`alert-container ${className}`} ref={alertBox} >
      <div className={`alert ${type} ${showClass ? 'show' : ''}`} onClick={toggleShowClass}>
        {message}
      </div>
    </div>
  );
};

export default AlertMessage;
