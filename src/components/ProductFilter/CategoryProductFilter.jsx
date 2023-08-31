import React from 'react'
import './style.scss'
import FilterBy from '../Button/FilterBy'
import Filters from '../Button/Filters'

const CategoryProductFilter = () => {
  return (
    <>
      <div className='prod-filter-container'>
        <div className='group-filterby'>
            <FilterBy label='Condition' />
            <FilterBy label='Deal Option' />
            <FilterBy label='Price' />
        </div>
        <Filters />
      </div>
    </>
  )
}

export default CategoryProductFilter
