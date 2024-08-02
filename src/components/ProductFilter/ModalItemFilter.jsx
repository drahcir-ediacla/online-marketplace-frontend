import React, { useState, useEffect } from 'react'
import axios from '../../apicalls/axios'
import './style.scss'
import { useDispatch } from 'react-redux'
import { Setloader } from '../../redux/reducer/loadersSlice'
import { ReactComponent as FilterIcon } from '../../assets/images/filter-icon.svg'
import BtnClear from '../Button/BtnClear'
import BtnGreen from '../Button/BtnGreen'
import RadioButton from '../FormField/RadioButton'
import CheckBox from '../FormField/CheckBox/CheckBox'
import Input from '../FormField/Input'

const ModalItemFilter = ({ className, userId, userData, filteredListings, authenticatedUser, err }) => {

    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState(0);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openContent = (tabIndex) => {
        setActiveTab(tabIndex);
    };


    const toggleModal = () => {
        setIsModalOpen((prevIsModalOpen) => !prevIsModalOpen);
    };

    const [activeFilter, setActiveFilter] = useState(null);
    const [sortBy, setSortBy] = useState('Most Recent');

    const [tempFilters, setTempFilters] = useState({
        condition: [],
        sort: '',
    });
    const [tempFilterPrice, setTempFilterPrice] = useState({
        minPrice: '',
        maxPrice: '',
    });

    const [filters, setFilters] = useState({
        condition: [],
        sort: '',
    });

    const [filterPrice, setFilterPrice] = useState({
        minPrice: '',
        maxPrice: '',
    })





    useEffect(() => {
        const fetchData = async () => {
            dispatch(Setloader(true));

            try {
                // Fetch the user's profile data
                const response = await axios.get(`/api/user/${userId}`, {
                    params: {
                        ...filters,
                        ...filterPrice,
                        sort: filters.sort,
                    }
                });

                userData(response.data);
                filteredListings(response.data?.products)


                // Fetch the authenticated user's data
                const authResponse = await axios.get('/auth/check-auth');
                authenticatedUser(authResponse.data.user);

                dispatch(Setloader(false));
            } catch (error) {
                dispatch(Setloader(false));
                console.error('Error fetching data:', error);

                // Check if the error is due to unauthorized access
                if (error.response && error.response.status === 401) {
                    console.error('User not authenticated');
                    // Handle unauthorized access, e.g., redirect to login
                } else {
                    // Handle other errors
                    err(true); // Depending on your requirements
                }
            }
        };

        fetchData();
    }, [userId, filters, dispatch]);


    const handleSortByChange = (event) => {
        const selectedSortBy = event.target.value;
        setSortBy(selectedSortBy);
        setTempFilters((prevTempFilters) => ({ ...prevTempFilters, sort: selectedSortBy }));
    };


    const handleFilterChange = (event) => {
        const { name, value, checked } = event.target;

        setTempFilters((prevTempFilters) => ({
            ...prevTempFilters,
            [name]: name === 'condition'
                ? checked
                    ? [...prevTempFilters.condition, value]
                    : prevTempFilters.condition.filter((condition) => condition !== value)
                : value,
        }));
    };


    const handlePriceChange = (event) => {
        const { name, value } = event.target;
        setTempFilterPrice((prevTempFilters) => ({ ...prevTempFilters, [name]: value }));
    };


    const applyFilters = () => {
        setFilters({
            ...tempFilters,
            applied: true,
        });
        setFilterPrice({ ...tempFilterPrice });
    };



    const resetFilters = () => {
        // setFilterPrice({
        //     minPrice: '',
        //     maxPrice: '',
        // });

        // setFilters({
        //     condition: [],
        //     sort: '',
        // });

        const minPriceInput = document.querySelector('input[name="minPrice"]');
        const maxPriceInput = document.querySelector('input[name="maxPrice"]');

        if (minPriceInput && maxPriceInput) {
            minPriceInput.value = '';
            maxPriceInput.value = '';
        }
        setTempFilterPrice({
            minPrice: '',
            maxPrice: '',
        });

        setTempFilters({
            condition: [],
            sort: '',
        });
    };


    const handleEnterKeyPress = (event) => {
        if (event.key === 'Enter') {
            applyFilters();
            setIsModalOpen((prevIsModalOpen) => !prevIsModalOpen);
        }
    };


    return (
        <>
            <button className={`custom-filter-button ${className}`} onClick={toggleModal}>
                <span>Filters</span><div className="svg-style"><FilterIcon /></div>
            </button>
            {isModalOpen && (
                <div className="item-filter-modal-container">
                    <div className="item-filter-modal-box">
                        <div className="item-filter-modal-row1">
                            <button className='closebtn' onClick={toggleModal}>
                                <i class='fa fa-times'></i>
                            </button>
                        </div>
                        <div className="item-filter-modal-row2">
                            <div className="item-filter-modal-row2-col1">
                                <ul className="filter-options">
                                    <li className={`filter-tab ${activeTab === 0 ? 'active' : ''}`} onClick={() => openContent(0)}>
                                        Sort By
                                        <div className='filter-arrow'></div>
                                    </li>
                                    <li className={`filter-tab ${activeTab === 1 ? 'active' : ''}`} onClick={() => openContent(1)}>
                                        Condition
                                        <div className='filter-arrow'></div>
                                    </li>
                                    <li className={`filter-tab ${activeTab === 2 ? 'active' : ''}`} onClick={() => openContent(2)}>
                                        Deal Option
                                        <div className='filter-arrow'></div>
                                    </li>
                                    <li className={`filter-tab ${activeTab === 3 ? 'active' : ''}`} onClick={() => openContent(3)}>
                                        Price
                                        <div className='filter-arrow'></div>
                                    </li>
                                </ul>
                            </div>
                            <div className="item-filter-modal-row2-col2">
                                <div className="filter-sortby-box">
                                    <ul className='filter-sort-by-options' style={{ display: activeTab === 0 ? 'block' : 'none' }}>
                                        <li>
                                            <RadioButton
                                                id="mostRecent"
                                                name="sort"
                                                value="recent"
                                                label="Most Recent"
                                                checked={sortBy === 'Most Recent' || tempFilters.sort.includes('recent')}
                                                onChange={handleSortByChange}
                                            />
                                        </li>
                                        <li>
                                            <RadioButton
                                                id="priceLowtoHigh"
                                                name="sort"
                                                value="lowToHigh"
                                                label="Price - Low to High"
                                                checked={sortBy === 'Price - Low to High' || tempFilters.sort.includes('lowToHigh')}
                                                onChange={handleSortByChange}
                                            />
                                        </li>
                                        <li>
                                            <RadioButton
                                                id="priceHighToLow"
                                                name="sort"
                                                value="highToLow"
                                                label="Price - High to Low"
                                                checked={sortBy === 'Price - High to Low' || tempFilters.sort.includes('highToLow')}
                                                onChange={handleSortByChange}
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div className="filter-condition-box" style={{ display: activeTab === 1 ? 'flex' : 'none' }}>
                                    <div className="filter-condition-box-col1">
                                        <ul className="filter-condition-options">
                                            <li>
                                                <CheckBox
                                                    name='condition'
                                                    label='Brand New'
                                                    value='Brand New'
                                                    checked={tempFilters.condition.includes('Brand New')}
                                                    onChange={handleFilterChange}
                                                />
                                            </li>
                                            <li>
                                                <CheckBox
                                                    name='condition'
                                                    label='Like New'
                                                    value='Like New'
                                                    checked={tempFilters.condition.includes('Like New')}
                                                    onChange={handleFilterChange}
                                                />
                                            </li>
                                            <li>
                                                <CheckBox
                                                    name='condition'
                                                    label='Lightly Used'
                                                    value='Lightly Used'
                                                    checked={tempFilters.condition.includes('Lightly Used')}
                                                    onChange={handleFilterChange}
                                                />
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="filter-condition-box-col2">
                                        <ul className="filter-condition-options">
                                            <li>
                                                <CheckBox
                                                    name='condition'
                                                    label='Well Used'
                                                    value='Well Used'
                                                    checked={tempFilters.condition.includes('Well Used')}
                                                    onChange={handleFilterChange}
                                                />
                                            </li>
                                            <li>
                                                <CheckBox
                                                    name='condition'
                                                    label='Heavily Used'
                                                    value='Heavily Used'
                                                    checked={tempFilters.condition.includes('Heavily Used')}
                                                    onChange={handleFilterChange}
                                                />
                                            </li>
                                        </ul>
                                    </div>

                                </div>
                                <div className="filter-deal-box" style={{ display: activeTab === 2 ? 'block' : 'none' }}>
                                    <ul className='filter-deal-options'>
                                        <li>
                                            <CheckBox
                                                label='Meet Up'
                                                value='Meet Up'
                                            />
                                        </li>
                                        <li>
                                            <CheckBox
                                                label='Mailing and Delivery'
                                                value='Mailing and Delivery'
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div className="filter-price-range-options" style={{ display: activeTab === 3 ? 'block' : 'none' }}>
                                    <p>Show item price from</p>
                                    <div className='input-price-range-box'>
                                        <div className='input-price-range-filter-container'>
                                            <span className='php-symbol'>₱</span>
                                            <Input
                                                type='number'
                                                name="minPrice"
                                                value={tempFilterPrice.minPrice}
                                                onChange={handlePriceChange}
                                                onKeyPress={handleEnterKeyPress}
                                                className='input-price-filter'
                                                placeholder='Minimum'
                                            />
                                        </div>
                                        -
                                        <div className='input-price-range-filter-container'>
                                            <span className='php-symbol'>₱</span>
                                            <Input
                                                type='number'
                                                name="maxPrice"
                                                value={tempFilterPrice.maxPrice}
                                                onChange={handlePriceChange}
                                                onKeyPress={handleEnterKeyPress}
                                                className='input-price-filter'
                                                placeholder='Maximum'
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="item-filter-modal-row3">
                            <BtnClear label='Reset All' onClick={resetFilters} />
                            <BtnGreen label='Apply' className='apply-btn' onClick={() => { applyFilters(); toggleModal(); }} onKeyPress={handleEnterKeyPress} />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ModalItemFilter
