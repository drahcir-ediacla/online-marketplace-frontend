import React from 'react';
import './CheckBox.scss';

const CheckBox = ({ label, checked, onChange, value, name }) => {
  return (
    <label className='checkbox-region'>
      {label}
      <input type="checkbox" className='checkbox' name={name} value={value} checked={checked} onChange={onChange} />
      <span className="checkmark"></span>
    </label>
  );
}

export default CheckBox;
