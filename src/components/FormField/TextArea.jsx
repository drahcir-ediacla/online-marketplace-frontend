import React from 'react'
import './style.css'

const TextArea = ({name, id, cols, rows, className}) => {
  return (
    <>
      <textarea name={name} id={id} cols={cols} rows={rows} className={`custom-textarea ${className}`}></textarea>
    </>
  )
}

export default TextArea
