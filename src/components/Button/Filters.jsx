import React from 'react'
import './Button.css'
import { ReactComponent as FilterIcon } from '../../assets/images/filter-icon.svg'

const Filters = ({onClick, className}) => {
  return (
    <>
        <button className={`custom-filter-button ${className}`} onClick={onClick}>
            <span>Filters</span><div className="svg-style"><FilterIcon /></div>
        </button>
    </>
  )
}

export default Filters
