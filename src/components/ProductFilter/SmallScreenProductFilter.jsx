import { useState } from 'react'
import axios from '../../apicalls/axios'
import { ReactComponent as FilterIcon } from '../../assets/images/filter-icon.svg'
import RadioButton from '../FormField/RadioButton';
import CheckBox from '../FormField/CheckBox/CheckBox';
import Input from '../FormField/Input'
import BtnGreen from '../Button/BtnGreen'
import BtnClear from '../Button/BtnClear'

export const SmallScreenProductFilter = ({ categoryId, value, updateCategoryData }) => {

    const [filterOpen, setFilterOpen] = useState(false);
    const [sortBy, setSortBy] = useState('Most Recent');
    const [filters, setFilters] = useState({
        condition: [],
        sort: '',
    });

    const [filterPrice, setFilterPrice] = useState({
        minPrice: '',
        maxPrice: '',
    })

    const toggleFilter = () => {
        setFilterOpen((prevFilterOpen) => !prevFilterOpen)
    }

    const fetchData = async () => {
        try {
            const response = await axios.get(`/api/getcategory/${categoryId}/${value}`, {
                params: {
                    ...filters,
                    ...filterPrice,
                    sort: filters.sort,
                }
            });

            // Update the category data in the parent component
            updateCategoryData(response.data);
        } catch (error) {
            console.error('Error fetching category data:', error);
        }
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
            [name]: name === 'condition'
                ? checked
                    ? [...prevFilters.condition, value] // Add the value to the array if checked
                    : prevFilters.condition.filter((condition) => condition !== value) // Remove the value if unchecked
                : value,
        }));
    };


    const handlePriceChange = (event) => {
        const { name, value } = event.target;
        setFilterPrice((prevFilters) => ({ ...prevFilters, [name]: value }));
    };

    const resetFilters = () => {
        setFilterPrice({
            minPrice: '',
            maxPrice: '',
        });

        setFilters({
            condition: [],
            sort: 'recent',
        })
    };



    return (
        <>
            <div className='small-screen-prod-filter-container'>
                <button className='custom-filter-button' onClick={toggleFilter}>
                    <span>Filter Items</span><div className="filter-icon"><FilterIcon /></div>
                </button>
            </div>
            {filterOpen &&
                <div className="ss-product-filter-form">
                    <div className="ss-product-filter-form-row1">
                        <span>Filter Items</span>
                        <div className="ss-product-filter-form-close-btn" onClick={toggleFilter}>
                            <i className="fa fa-times"></i>
                        </div>
                    </div>
                    <div className='ss-product-filter-form-row2'>
                        <div className="all-filter-options-container">
                            <div className="sortby-container">
                                <span className='filter-options-label'>Sort By</span>
                                <div className="sortby-options">
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
                                </div>
                            </div>
                            <div className="filterby-condition-container">
                                <span className='filter-options-label'>Conditions</span>
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
                            </div>
                            <div className="deal-options-container">
                                <span className='filter-options-label'>Deal Options</span>
                                <ul className='filter-deal-options'>
                                    <li><CheckBox label='Meet Up' value='Meet Up' /></li>
                                    <li><CheckBox label='Mailing and Delivery' value='Mailing and Delivery' /></li>
                                </ul>
                            </div>
                            <div className='filter-price-input'>
                                <span className='filter-options-label'>Show item price from</span>
                                <div className='filter-price-row1'>
                                    <div className='input-price-filter-container'>
                                        <span className='php-symbol'>₱</span>
                                        <Input
                                            type='number'
                                            name="minPrice"
                                            className='input-price-filter'
                                            placeholder='Minimum'
                                            value={filterPrice.minPrice}
                                            onChange={handlePriceChange}
                                        />
                                    </div>
                                    <div className='input-price-filter-container'>
                                        <span className='php-symbol'>₱</span>
                                        <Input
                                            type='number'
                                            name="maxPrice"
                                            className='input-price-filter'
                                            placeholder='Maximum'
                                            value={filterPrice.maxPrice}
                                            onChange={handlePriceChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="filter-buttons">
                            <BtnClear label='Reset' onClick={resetFilters} />
                            <BtnGreen label='Apply' onClick={() => { fetchData(); toggleFilter(); }} />
                        </div>
                    </div>
                </div>
            }
        </>
    )
}