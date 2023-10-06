import React from 'react'
import './style.css'

const Input = ({ id, name, value, type, className, placeholder, onChange }) => {
  return (
    <>
      <input type={type} id={id} name={name} value={value} onChange={onChange} className={`custom-input ${className}`} placeholder={placeholder}/>
    </>
  )
}

export default Input