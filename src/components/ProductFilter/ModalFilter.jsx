import React, { useState } from 'react'
import './style.scss'
import { ReactComponent as FilterIcon } from '../../assets/images/filter-icon.svg'
import BtnClear from '../Button/BtnClear'
import BtnGreen from '../Button/BtnGreen'
import RadioButton from '../FormField/RadioButton'
import CheckBox from '../FormField/CheckBox/CheckBox'
import Input from '../FormField/Input'

const ModalFilter = ({ onClick, className }) => {

    const [activeTab, setActiveTab] = useState(0);

    const openContent = (tabIndex) => {
        setActiveTab(tabIndex);
    };


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
                                            label='Most Recent' />
                                    </li>
                                    <li>
                                        <RadioButton
                                            label='Price - Low to High' />
                                    </li>
                                    <li>
                                        <RadioButton
                                            label='Price - High to Low' />
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
                                    </ul>
                                </div>
                                <div className="filter-condition-box-col2">
                                    <ul className="filter-condition-options">
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
                                            className='input-price-filter'
                                            placeholder='Minimum' />
                                    </div>
                                    -
                                    <div className='input-price-range-filter-container'>
                                        <span className='php-symbol'>₱</span>
                                        <Input
                                            type='number'
                                            name="maxPrice"
                                            className='input-price-filter'
                                            placeholder='Maximum' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="item-filter-modal-row3">
                        <BtnClear label='Reset' />
                        <BtnGreen label='Apply' />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ModalFilter
