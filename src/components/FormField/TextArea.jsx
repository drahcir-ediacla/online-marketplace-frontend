import React from 'react'
import './style.css'

const TextArea = ({name, id, cols, rows, value, onChange, className, placeholder, readOnly}) => {
  return (
    <>
      <textarea name={name} id={id} value={value} onChange={onChange} cols={cols} rows={rows} className={`custom-textarea ${className}`} placeholder={placeholder} readOnly={readOnly}></textarea>
    </>
  )
}

export default TextArea
