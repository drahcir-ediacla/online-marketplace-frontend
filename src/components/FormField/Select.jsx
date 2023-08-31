import React from 'react';

const Select = ({ name, id, data, onSelect, className }) => {
  const handleSelectChange = (e) => {
    const selectedIndex = e.target.value;
    onSelect(data[selectedIndex].value);
  };

  

  return (
    <div className='select-box'>
        <select name={name} id={id} onChange={handleSelectChange} className={`custom-select ${className}`}>
        {data.map((option, index) => (
            <option key={`${index}-${option.value}`} value={index}>
            {option.label}
            </option>
        ))}
        </select>
        <div className='select-arrow-down'></div>
    </div>
  );
};

export default Select;
