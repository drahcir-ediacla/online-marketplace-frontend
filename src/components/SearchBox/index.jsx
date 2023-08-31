import React from 'react'
import './style.scss'
import { ReactComponent as MagnifyingGlass } from '../../assets/images/magnifying-glass.svg'

const SearchBox = ({placeholder, className}) => {
  return (
    <>
      <div className='search-box-container'>
        <input type="text" placeholder={placeholder} className={`search-box-input ${className}`} />
        <div className='search-icon'><MagnifyingGlass /></div>
      </div>
      
    </>
  )
}

export default SearchBox
