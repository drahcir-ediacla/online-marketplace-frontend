import React from 'react'
import './style.css'

const Input = ({ id, name, value, type, className, placeholder, onChange, onKeyDown, onKeyPress, disabled, defaultValue, readOnly }) => {
  return (
    <>
      <input type={type} id={id} name={name} value={value} onChange={onChange} onKeyDown={onKeyDown} onKeyPress={onKeyPress} disabled={disabled} defaultValue={defaultValue} readOnly={readOnly} className={`custom-input ${className}`} placeholder={placeholder} />
    </>
  )
}

export default Input