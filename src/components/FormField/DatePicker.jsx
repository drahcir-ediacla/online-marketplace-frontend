import React, { useRef, useEffect } from 'react';
import './style.css'
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const DatePicker = ({id, name, className, value, onChange}) => {

  const flatpickrRef = useRef(null);

  useEffect(() => {
    const options = {
      dateFormat: 'Y-m-d',
      defaultDate: value, // Set the default date
      onChange: function (selectedDates, dateStr) {
        if (onChange) {
          onChange({ target: { name, value: dateStr } }); // Notify the parent component of the change
        }
      },
    };
    flatpickr(flatpickrRef.current, options);
  }, [value, name, onChange]);

  return (
    <>
      <div className="date-picker-box">
        <div className="calendar-icon"><i class="fa-solid fa-calendar"></i></div>
        <input id={id} name={name} className={`custom-date active ${className}`} type="date" placeholder="MM/DD/YYYY" ref={flatpickrRef} value={value} onChange={onChange} />
      </div>
    </>
  )
}

export default DatePicker
