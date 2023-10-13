import React from 'react';
import './style.css'

const DependentSelect = ({ id, value, data, defaultOption, onChange, className }) => {
  return (
    <div className='select-box'>
      <select id={id} value={value} onChange={onChange} className={`custom-select ${className}`}>
      <option value="" hidden>{defaultOption}</option> 
        {data.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className='select-arrow-down'></div>
    </div>
  );
};

export default DependentSelect;
