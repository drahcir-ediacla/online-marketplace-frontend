// CustomSelect.js
import React, { useState, useEffect } from 'react';
import './CustomSelect.css'; // Import your CSS file for styling

const CustomSelect = ({ data, onSelect, className, defaultSelected }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const defaultOption = data.find(option => option.value === defaultSelected);
    setSelectedOption(defaultOption);
  }, [defaultSelected, data]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    // onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className={`custom-select ${className} ${isOpen ? 'open' : ''}`} onClick={toggleDropdown}>
      <div className="selected-option">
        {selectedOption ? selectedOption.label : 'Select an option'}
      </div>
      <div className='arrow-down'></div>
      <div className="options">
        {data.map((option) => (
          <div
            key={option.value}
            className={`option ${selectedOption === option ? 'selected' : ''}`}
            onClick={() => handleOptionClick(option)}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomSelect;
