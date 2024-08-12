import React from 'react';
import './style.css'

const Select = ({ name, id, data, value, onSelect, className, onChange, defaultOption }) => {
  // const handleSelectChange = (e) => {
  //   const selectedIndex = e.target.value;
  //   onSelect(data[selectedIndex].value);
  // };

  
  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    onSelect(selectedValue);
  };

  

  return (
    <div className='select-box'>
        <select name={name} id={id} value={value} onChange={onChange} onSelect={handleSelectChange} className={`custom-select ${className}`}>
        <option value="" hidden>{defaultOption}</option> 
        {data.map((option, index) => (
            // <option key={`${index}-${option.value}`} value={index}>
            <option key={option.value} value={option.value}>
            {option.label}
            </option>
        ))}
        </select>
        <div className='select-arrow-down'></div>
    </div>
  );
};

export default Select;
