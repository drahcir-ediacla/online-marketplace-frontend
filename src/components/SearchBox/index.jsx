import React from 'react'
import './style.scss'
import { ReactComponent as MagnifyingGlass } from '../../assets/images/magnifying-glass.svg'

const SearchBox = ({placeholder, value, className, onChange}) => {
  return (
    <>
      <div className='search-box-container'>
        <input type="text" value={value} placeholder={placeholder} className={`search-box-input ${className}`} onChange={onChange} />
        <div className='search-icon'><MagnifyingGlass /></div>
      </div>
      
    </>
  )
}

export default SearchBox
