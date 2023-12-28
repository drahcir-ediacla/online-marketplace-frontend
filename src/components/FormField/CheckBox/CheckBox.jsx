import React from 'react';
import './CheckBox.scss';

const CheckBox = ({ label, checked, onChange, value }) => {
  return (
    <label className='checkbox-region'>
      {label}
      <input type="checkbox" className='checkbox' value={value} checked={checked} onChange={onChange} />
      <span className="checkmark"></span>
    </label>
  );
}

export default CheckBox;
