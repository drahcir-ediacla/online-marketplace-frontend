import React, { useState, useEffect, useRef } from 'react'
import './style.scss'
import FilterBy from '../Button/FilterBy'
import Filters from '../Button/Filters'
import CheckBox from '../FormField/CheckBox/CheckBox'
import Input from '../FormField/Input'

const CategoryProductFilter = () => {

  const [activeFilter, setActiveFilter] = useState(null);

  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setActiveFilter(null);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleFilterVisibility = (filter) => {
    setActiveFilter(activeFilter === filter ? null : filter);
  };


  return (
    <>
      <div className='prod-filter-container' ref={containerRef}>
        <div className='group-filterby'>
          <div className='filter-condition'>
            <FilterBy label='Condition' onClick={() => toggleFilterVisibility('condition')} />
            {activeFilter === 'condition' && (
              <ul className='filter-condition-options'>
                <li><CheckBox label='Brand New' value='Brand New' /></li>
                <li><CheckBox label='Like New' value='Like New' /></li>
                <li><CheckBox label='Lightly Used' value='Lightly Used' /></li>
                <li><CheckBox label='Well Used' value='Well Used' /></li>
                <li><CheckBox label='Heavily Used' value='Heavily Used' /></li>
              </ul>
            )}
          </div>
          <div className='filter-deal-option'>
            <FilterBy label='Deal Option' onClick={() => toggleFilterVisibility('dealOption')} />
            {activeFilter === 'dealOption' && (
              <ul className='filter-deal-options'>
                <li><CheckBox label='Meet Up' value='Meet Up' /></li>
                <li><CheckBox label='Mailing and Delivery' value='Mailing and Delivery' /></li>
              </ul>
            )}
          </div>
          <div className='filter-price'>
            <FilterBy label='Price' />
            <div className='filter-price-input'>
                <p>Show item price from</p>
                <div className='filter-price-row1'>
                  <Input />
                </div>
            </div>
          </div>

        </div>
        <Filters />
      </div>
    </>
  )
}

export default CategoryProductFilter
