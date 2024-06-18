import { useState } from 'react'
import { ReactComponent as FilterIcon } from '../../assets/images/filter-icon.svg'
import RadioButton from '../FormField/RadioButton';
import CheckBox from '../FormField/CheckBox/CheckBox';
import Input from '../FormField/Input'
import BtnGreen from '../Button/BtnGreen'
import BtnClear from '../Button/BtnClear'

export const SmallScreenProductFilter = () => {

    const [filterOpen, setFilterOpen] = useState(false);

    const toggleFilter = () => {
        setFilterOpen((prevFilterOpen) => !prevFilterOpen)
    }

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
                                        />
                                    </li>
                                    <li>
                                        <RadioButton
                                            id="priceHighToLow"
                                            name="sort"
                                            value="highToLow"
                                            label="Price - High to Low"
                                        />
                                    </li>
                                    <li>
                                        <RadioButton
                                            id="priceLowtoHigh"
                                            name="sort"
                                            value="lowToHigh"
                                            label="Price - Low to High"
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
                                    />
                                </li>
                                <li>
                                    <CheckBox
                                        name='condition'
                                        label='Like New'
                                        value='Like New'
                                    />
                                </li>
                                <li>
                                    <CheckBox
                                        name='condition'
                                        label='Lightly Used'
                                        value='Lightly Used'
                                    />
                                </li>
                                <li>
                                    <CheckBox
                                        name='condition'
                                        label='Well Used'
                                        value='Well Used'
                                    />
                                </li>
                                <li>
                                    <CheckBox
                                        name='condition'
                                        label='Heavily Used'
                                        value='Heavily Used'
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
                                    />
                                </div>
                                <div className='input-price-filter-container'>
                                    <span className='php-symbol'>₱</span>
                                    <Input
                                        type='number'
                                        name="maxPrice"
                                        className='input-price-filter'
                                        placeholder='Maximum'
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="filter-buttons">
                            <BtnClear label='Clear' />
                            <BtnGreen label='Apply' />
                        </div>
                    </div>
                </div>
            }
        </>
    )
}