import React from 'react'
import './style.css'

const Input = ({ type, className, placeholder }) => {
  return (
    <>
      <input type={type} className={`custom-input ${className}`} placeholder={placeholder}/>
    </>
  )
}

export default Input