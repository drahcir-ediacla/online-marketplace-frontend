import React, { useRef, useEffect } from 'react';
import './style.css'
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const DatePicker = ({id, className}) => {

  const flatpickrRef = useRef(null);

  useEffect(() => {
    flatpickr(flatpickrRef.current, {
      dateFormat: 'Y-m-d', // Customize the date format
    });
  }, []);

  return (
    <>
      <div className="date-picker-box">
        <div className="calendar-icon"><i class="fa-solid fa-calendar"></i></div>
        <input id={id} className={`custom-date active ${className}`} type="datecheck" placeholder="MM/DD/YYYY" ref={flatpickrRef} />
      </div>
    </>
  )
}

export default DatePicker
