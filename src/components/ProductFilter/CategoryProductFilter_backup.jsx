import React, { useState, useEffect, useRef } from 'react';
import axios from '../../apicalls/axios';
import './style.scss';
import FilterBy from '../Button/FilterBy';
import CheckBox from '../FormField/CheckBox/CheckBox';
import Input from '../FormField/Input';
import BtnClear from '../Button/BtnClear';
import BtnGreen from '../Button/BtnGreen';
import RadioButton from '../FormField/RadioButton';

const CategoryProductFilter = ({ categoryId, value, updateCategoryData, page, fetchProducts, updateLoadingRecent, updateHasMore }) => {

  const [hasMore, setHasMore] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [limit] = useState(2);
  const [activeFilter, setActiveFilter] = useState(null);
  const [sortBy, setSortBy] = useState('Most Recent');
  const [filters, setFilters] = useState({
    condition: [],
    sort: '',
    dealOption: [],
  });

  const [filterPrice, setFilterPrice] = useState({
    minPrice: '',
    maxPrice: '',
  });

  const [currentCategory, setCurrentCategory] = useState(categoryId);
  const containerRef = useRef(null);

  useEffect(() => {
    // Reset filters when the category changes
    setFilters({
      condition: [],
      sort: '',
      dealOption: [],
    });
    setFilterPrice({
      minPrice: '',
      maxPrice: '',
    });
    setCurrentCategory(categoryId);
  }, [categoryId]);

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

  useEffect(() => {
    if (loadingRecent || !hasMore) return; // Don't fetch if already loading or no more data

    setLoadingRecent(true);
    updateLoadingRecent(true);
    // Perform API call with the selected filters and sorting option
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/getcategory/${categoryId}/${value}/?page=${page}&limit=${limit}`, {
          params: {
            ...filters,
            ...filterPrice,
            sort: filters.sort,
          },
        });

        const categorydata = response.data
        fetchProducts((prevData) => {
          const uniqueData = categorydata?.allProducts?.filter(
            (item) => !prevData.some((existingItem) => existingItem.id === item.id)
          );
          return [...prevData, ...uniqueData];
        });

        setHasMore(categorydata.length > 0);
        updateHasMore(categorydata.length > 0);
        // Update the category data in the parent component
        updateCategoryData(response.data);
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setLoadingRecent(false);
        updateLoadingRecent(false);
      }
    };

    fetchData();
  }, [categoryId, value, filters, page, limit]);

  const toggleFilterVisibility = (filter) => {
    setActiveFilter(activeFilter === filter ? null : filter);
  };

  const handleSortByChange = (event) => {
    const selectedSortBy = event.target.value;
    setSortBy(selectedSortBy); // Update the local state
    setFilters((prevFilters) => ({ ...prevFilters, sort: selectedSortBy }));
  };

  const handleFilterChange = (event) => {
    const { name, value, checked } = event.target;

    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: name === 'condition' || name === 'dealOption'
        ? checked
          ? [...prevFilters[name], value] // Add the value to the array if checked
          : prevFilters[name].filter((filterValue) => filterValue !== value) // Remove the value if unchecked
        : value,
    }));
  };

  const handlePriceChange = (event) => {
    const { name, value } = event.target;
    setFilterPrice((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const applyFilters = () => {
    setFilters((prevFilters) => ({ ...prevFilters, applied: true }));
  };

  const resetFilters = () => {
    setFilterPrice({
      minPrice: '',
      maxPrice: '',
    });

    setFilters((prevFilters) => ({
      ...prevFilters,
      condition: [],
      sort: '',
      dealOption: [],
      applied: false, // Reset the applied property
    }));

    // Reset the input fields
    const minPriceInput = document.querySelector('input[name="minPrice"]');
    const maxPriceInput = document.querySelector('input[name="maxPrice"]');

    if (minPriceInput && maxPriceInput) {
      minPriceInput.value = '';
      maxPriceInput.value = '';
    }
  };

  const handleEnterKeyPress = (event) => {
    if (event.key === 'Enter') {
      applyFilters();
    }
  };

  return (
    <>
      <div className='prod-filter-container' ref={containerRef}>
        <div className='group-filterby'>
          <div className='filter-sortby'>
            <FilterBy
              label='Sort By'
              arrowStyle={activeFilter === 'sortByFilter' ? { transform: 'rotate(-180deg)', transition: '0.5s ease' } : { transform: 'none', transition: '0.5s ease' }}
              onClick={() => toggleFilterVisibility('sortByFilter')}
            />
            {activeFilter === 'sortByFilter' && (
              <ul className='filter-sortby-options'>
                <li>
                  <RadioButton
                    id="mostRecent"
                    name="sort"
                    value="recent"
                    label="Most Recent"
                    checked={sortBy === 'Most Recent' || filters.sort.includes('recent')}
                    onChange={handleSortByChange}
                  />
                </li>
                <li>
                  <RadioButton
                    id="priceHighToLow"
                    name="sort"
                    value="highToLow"
                    label="Price - High to Low"
                    checked={sortBy === 'Price - High to Low' || filters.sort.includes('highToLow')}
                    onChange={handleSortByChange}
                  />
                </li>
                <li>
                  <RadioButton
                    id="priceLowtoHigh"
                    name="sort"
                    value="lowToHigh"
                    label="Price - Low to High"
                    checked={sortBy === 'Price - Low to High' || filters.sort.includes('lowToHigh')}
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
              onClick={() => toggleFilterVisibility('condition')}
            />
            {activeFilter === 'condition' && (
              <ul className='filter-condition-options'>
                <li>
                  <CheckBox
                    name='condition'
                    label='Brand New'
                    value='Brand New'
                    checked={filters.condition.includes('Brand New')}
                    onChange={handleFilterChange}
                  />
                </li>
                <li>
                  <CheckBox
                    name='condition'
                    label='Like New'
                    value='Like New'
                    checked={filters.condition.includes('Like New')}
                    onChange={handleFilterChange}
                  />
                </li>
                <li>
                  <CheckBox
                    name='condition'
                    label='Lightly Used'
                    value='Lightly Used'
                    checked={filters.condition.includes('Lightly Used')}
                    onChange={handleFilterChange}
                  />
                </li>
                <li>
                  <CheckBox
                    name='condition'
                    label='Well Used'
                    value='Well Used'
                    checked={filters.condition.includes('Well Used')}
                    onChange={handleFilterChange}
                  />
                </li>
                <li>
                  <CheckBox
                    name='condition'
                    label='Heavily Used'
                    value='Heavily Used'
                    checked={filters.condition.includes('Heavily Used')}
                    onChange={handleFilterChange}
                  />
                </li>
              </ul>
            )}
          </div>
          <div className='filter-deal-option'>
            <FilterBy
              label='Deal Option'
              arrowStyle={activeFilter === 'dealOption' ? { transform: 'rotate(-180deg)', transition: '0.5s ease' } : { transform: 'none', transition: '0.5s ease' }}
              onClick={() => toggleFilterVisibility('dealOption')}
            />
            {activeFilter === 'dealOption' && (
              <ul className='filter-deal-options'>
                <li>
                  <CheckBox
                    name='dealOption'
                    label='Meet Up'
                    value='Meet Up'
                    checked={filters.dealOption.includes('Meet Up')}
                    onChange={handleFilterChange}
                  />
                </li>
                <li>
                  <CheckBox
                    name='dealOption'
                    label='Delivery'
                    value='Delivery'
                    checked={filters.dealOption.includes('Delivery')}
                    onChange={handleFilterChange}
                  />
                </li>
              </ul>
            )}
          </div>
          <div className='filter-price'>
            <FilterBy
              label='Price'
              arrowStyle={activeFilter === 'priceFilter' ? { transform: 'rotate(-180deg)', transition: '0.5s ease' } : { transform: 'none', transition: '0.5s ease' }}
              onClick={() => toggleFilterVisibility('priceFilter')}
            />
            {activeFilter === 'priceFilter' && (
              <div className='filter-price-input'>
                <p>Show item price from</p>
                <div className='filter-price-row1'>
                  <div className='input-price-filter-container'>
                    <span className='php-symbol'>₱</span>
                    <Input
                      type='number'
                      name="minPrice"
                      value={filterPrice.minPrice}
                      onChange={handlePriceChange}
                      onKeyPress={handleEnterKeyPress}
                      className='input-price-filter'
                      placeholder='Minimum'
                    />
                  </div>
                  -
                  <div className='input-price-filter-container'>
                    <span className='php-symbol'>₱</span>
                    <Input
                      type='number'
                      name="maxPrice"
                      value={filterPrice.maxPrice}
                      onChange={handlePriceChange}
                      onKeyPress={handleEnterKeyPress}
                      className='input-price-filter'
                      placeholder='Maximum'
                    />
                  </div>
                </div>
                <hr />
                <div className='filter-price-row2'>
                  <BtnClear label='Reset' onClick={resetFilters} />
                  <BtnGreen label='Apply' onClick={applyFilters} className="apply-price-range" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryProductFilter;
