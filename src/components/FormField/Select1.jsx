import React from 'react';

const Select1 = ({ id, label, value, data, defaultOption, onChange }) => {
  return (
    <div>
      <select id={id} value={value} onChange={onChange}>
      <option value="" hidden>{defaultOption}</option> 
        {data.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select1;
