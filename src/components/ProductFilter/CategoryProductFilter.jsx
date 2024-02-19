import React, { useState, useEffect, useRef } from 'react'
import './style.scss'
import FilterBy from '../Button/FilterBy'
import Filters from '../Button/Filters'
import CheckBox from '../FormField/CheckBox/CheckBox'
import Input from '../FormField/Input'
import BtnClear from '../Button/BtnClear'
import BtnGreen from '../Button/BtnGreen'
import RadioButton from '../FormField/RadioButton'

const CategoryProductFilter = () => {

  const [activeFilter, setActiveFilter] = useState(null);
  const [sortBy, setSortBy] = useState('Most Recent');

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


  const handleSortByChange = (event) => {
    const selectedSortBy = event.target.value;
    setSortBy(selectedSortBy); // Update the local state
  };


  return (
    <>
      <div className='prod-filter-container' ref={containerRef}>
        <div className='group-filterby'>
          <div className='filter-sortby'>
            <FilterBy
              label='Sort By'
              arrowStyle={activeFilter === 'sortByFilter' ? { transform: 'rotate(-180deg)', transition: '0.5s ease' } : { transform: 'none', transition: '0.5s ease' }}
              onClick={() => toggleFilterVisibility('sortByFilter')} />
            {activeFilter === 'sortByFilter' && (
              <ul className='filter-sortby-options'>
                <li>
                  <RadioButton
                    id="mostRecent"
                    name="most_recent"
                    value="Most Recent"
                    label="Most Recent"
                    checked={sortBy === 'Most Recent'}
                    onChange={handleSortByChange}
                  />
                </li>
                <li>
                  <RadioButton
                    id="priceHighToLow"
                    name="price_high_low"
                    value="Price High to Low"
                    label="Price - High to Low"
                    checked={sortBy === 'Price High to Low'}
                    onChange={handleSortByChange}
                  />
                </li>
                <li>
                  <RadioButton
                    id="priceLowtoHigh"
                    name="price_low_high"
                    value="Price Low to High"
                    label="Price - Low to High"
                    checked={sortBy === 'Price Low to High'}
                    onChange={handleSortByChange}
                  />
                </li>
              </ul>
            )}
          </div>
          <div className='filter-condition'>
            <FilterBy
              label='Condition'
              arrowStyle={activeFilter === 'condition' ? { transform: 'rotate(-180deg)', transition: '0.5s ease' } : { transform: 'none', transition: '0.5s ease' }}
              onClick={() => toggleFilterVisibility('condition')} />
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
            <FilterBy
              label='Deal Option'
              arrowStyle={activeFilter === 'dealOption' ? { transform: 'rotate(-180deg)', transition: '0.5s ease' } : { transform: 'none', transition: '0.5s ease' }}
              onClick={() => toggleFilterVisibility('dealOption')} />
            {activeFilter === 'dealOption' && (
              <ul className='filter-deal-options'>
                <li><CheckBox label='Meet Up' value='Meet Up' /></li>
                <li><CheckBox label='Mailing and Delivery' value='Mailing and Delivery' /></li>
              </ul>
            )}
          </div>
          <div className='filter-price'>
            <FilterBy
              label='Price'
              arrowStyle={activeFilter === 'priceFilter' ? { transform: 'rotate(-180deg)', transition: '0.5s ease' } : { transform: 'none', transition: '0.5s ease' }}
              onClick={() => toggleFilterVisibility('priceFilter')} />
            {activeFilter === 'priceFilter' && (
              <div className='filter-price-input'>
                <p>Show item price from</p>
                <div className='filter-price-row1'>
                  <div className='input-price-filter-container'>
                    <span className='php-symbol'>₱</span>
                    <Input type='number' className='input-price-filter' placeholder='Minimum' />
                  </div>
                  -
                  <div className='input-price-filter-container'>
                    <span className='php-symbol'>₱</span>
                    <Input type='number' className='input-price-filter' placeholder='Maximum' />
                  </div>
                </div>
                <hr />
                <div className='filter-price-row2'>
                  <BtnClear label='Reset' />
                  <BtnGreen label='Apply' />
                </div>
              </div>
            )}
          </div>
        </div>
        <Filters />
      </div>
    </>
  )
}

export default CategoryProductFilter
