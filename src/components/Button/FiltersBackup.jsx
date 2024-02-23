import React from 'react'
import './Button.css'
import { ReactComponent as FilterIcon } from '../../assets/images/filter-icon.svg'

const Filters = ({ onClick, className }) => {
  return (
    <>
      <button className={`custom-filter-button ${className}`} onClick={onClick}>
        <span>Filters</span><div className="svg-style"><FilterIcon /></div>
      </button>
      <div className="item-filter-modal-container">
        <div className="item-filter-modal-box">
          <div className="item-filter-modal-row1">
            <button className='closebtn' onClick={onClick}>
              <i class='fa fa-times'></i>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Filters
