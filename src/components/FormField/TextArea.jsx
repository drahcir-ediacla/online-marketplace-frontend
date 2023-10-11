import React from 'react'
import './style.css'

const TextArea = ({name, id, cols, rows, value, onChange, className}) => {
  return (
    <>
      <textarea name={name} id={id} value={value} onChange={onChange} cols={cols} rows={rows} className={`custom-textarea ${className}`}></textarea>
    </>
  )
}

export default TextArea
