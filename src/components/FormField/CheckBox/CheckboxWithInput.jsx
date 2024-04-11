import React, { useState } from 'react';

function CheckboxWithInput({ label, value }) {
  const [isChecked, setIsChecked] = useState(false);
  const [textValue, setTextValue] = useState('');

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    if (!isChecked) {
      // Clear the textarea when the checkbox is unchecked
      setTextValue('');
    }
  };

  const handleTextareaChange = (event) => {
    setTextValue(event.target.value);
  };

  return (
    <div>
      <label className='checkbox-region'>{label}<input type="checkbox" className='checkbox' value={value} checked={isChecked} onChange={handleCheckboxChange}/><span class="checkmark"></span></label>
      {isChecked && (
        <input
          value={textValue}
          onChange={handleTextareaChange}
        />
      )}
    </div>
  );
}

export default CheckboxWithInput;
