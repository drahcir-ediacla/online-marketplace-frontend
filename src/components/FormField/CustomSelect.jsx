// CustomSelect.js
import React, { useState, useEffect } from 'react';
import './CustomSelect.css'; // Import your CSS file for styling

const CustomSelect = ({ data, className, defaultSelected, onOptionSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  console.log('selectedOption123:', selectedOption)

  // useEffect(() => {
  //   const defaultOption = data[0].find(option => option.value === defaultSelected);
  //   setSelectedOption(defaultOption);
  // }, [defaultSelected, data]);


   const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onOptionSelect) {
      onOptionSelect(option);
    }
  };

  return (
    <div className={`custom-select ${className} ${isOpen ? 'open' : ''}`} onClick={toggleDropdown}>
      <div className="selected-option">
        {selectedOption ? selectedOption.label : 'Inbox'}
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
