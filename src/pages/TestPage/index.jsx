import React, { useState } from 'react';

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  // Add more options as needed
];

function CustomSelect() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  }

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  }

  return (
    <div className="custom-select">
      <div className={`select-container ${isOpen ? 'open' : ''}`}>
        <div className="selected-option" onClick={toggleDropdown}>
          {selectedOption.label || 'Select an option'}
        </div>
        {isOpen && (
          <div className="options">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <ul>
              {filteredOptions.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleOptionClick(option)}
                  className={option.value === selectedOption.value ? 'selected' : ''}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {selectedOption.value === 'option1' && (
        <div>
          <label>Field 1:</label>
          <input type="text" name="field1" />
          <label>Field 2:</label>
          <input type="text" name="field2" />
        </div>
      )}

      {selectedOption.value === 'option2' && (
        <div>
          <label>Field 3:</label>
          <input type="text" name="field3" />
        </div>
      )}
    </div>
  );
}

export default CustomSelect;
