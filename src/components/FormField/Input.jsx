import React from 'react'
import './style.css'

const Input = ({ id, name, value, type, className, placeholder, onChange, disabled, defaultValue, readOnly }) => {
  return (
    <>
      <input type={type} id={id} name={name} value={value} onChange={onChange} disabled={disabled} defaultValue={defaultValue} readOnly={readOnly} className={`custom-input ${className}`} placeholder={placeholder} />
    </>
  )
}

export default Input