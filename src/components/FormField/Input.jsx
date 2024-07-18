import React from 'react'
import './style.css'

const Input = ({ id, name, value, type, ref, className, style, placeholder, onChange, onKeyDown, onKeyPress, onFocus, disabled, defaultValue, readOnly }) => {
  return (
    <>
      <input 
      type={type} 
      id={id} 
      name={name} 
      value={value} 
      ref={ref} 
      onChange={onChange} 
      onKeyDown={onKeyDown} 
      onKeyPress={onKeyPress} 
      onFocus={onFocus} 
      disabled={disabled} 
      defaultValue={defaultValue} 
      readOnly={readOnly} 
      className={`custom-input ${className}`} 
      style={style}
      placeholder={placeholder} />
    </>
  )
}

export default Input