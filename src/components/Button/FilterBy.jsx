import React from 'react'
import './Button.css'

const FilterBy = ({onClick, className, label}) => {
  return (
    <>
        <button className={`custom-filterby-button ${className}`} onClick={onClick}>
            <span>{label}</span><div className="filterby-arrow-down"></div>
        </button>
    </>
  )
}

export default FilterBy
