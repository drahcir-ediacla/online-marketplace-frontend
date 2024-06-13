import React, { useState } from 'react'
import './style.scss'
import BtnGreen from '../../components/Button/BtnGreen';
import BtnClear from '../../components/Button/BtnClear'
import { ReactComponent as MagnifyingGlass } from '../../assets/images/magnifying-glass.svg';
import NearLocIcon from '../../assets/images/near-loc-icon.png'
import AllPhIcon from '../../assets/images/all-ph-icon.png'
import RegionIcon from '../../assets/images/region-icon.png'
import CityIcon from '../../assets/images/city-icon.png'
import userLocationData from '../../data/userLocationData.json'

const SmallScreenSearchByLoc = () => {

    const [searchItemOpen, setSearchItemOpen] = useState(false)
    const [selectRegionOpen, setSelectRegionOpen] = useState(false)
    const [activeOption, setActiveOption] = useState('allPh');
    const [selectedRegion, setSelectedRegion] = useState([]);

    const toggleSearchItemOpen = () => {
        setSearchItemOpen((prevSearchItemOpen) => !prevSearchItemOpen)
    }

    const toggleSelectRegionOpen = () => {
        setSelectRegionOpen((prevSelectRegionOpen) => !prevSelectRegionOpen)
        setSelectedRegion([])
    }

    const handleRegionClick = (selectedRegion) => {
        setSelectedRegion(selectedRegion);
    }

    const clearSelectedRegion = () => {
        setSelectedRegion([])
    }


    return (
        <>
            <div className='small-screen-magnifying-glass' onClick={toggleSearchItemOpen}><MagnifyingGlass /></div>
            {searchItemOpen &&
                <div className="ss-search-location-container">
                    <div className="ss-search-location-row1">
                        <div className="back-arrow" onClick={toggleSearchItemOpen}></div>
                        <div className='search-box-container'>
                            <input type='text' className='search-input' placeholder='Search items...' />
                            <input type='text' hidden />
                            <button><div className='btn-magnifying-glass'><MagnifyingGlass /></div></button>
                        </div>
                    </div>
                    <div className="ss-search-location-row2">
                        <small>Search by:</small>
                        {selectedRegion.length > 0 &&
                            <>
                                <p className='selected-region'>{selectedRegion}</p>
                                <div className='selected-city-container'>
                                    <p className='please-choose-city'>No city selected</p>
                                </div>
                            </>
                        }
                        <ul>
                            <li
                                className={activeOption === 'nearMe' ? 'active' : ''}
                                onClick={() => setActiveOption('nearMe')}
                            >
                                <div className='location-option'><img src={NearLocIcon} alt="" />Listing Near Me</div>
                            </li>
                            <li
                                className={activeOption === 'allPh' ? 'active' : ''}
                                onClick={() => setActiveOption('allPh')}
                            >
                                <div className='location-option'><img src={AllPhIcon} alt="" />All of the Philippines</div>
                            </li>
                            <li onClick={toggleSelectRegionOpen}><div className='location-option'><img src={RegionIcon} alt="" />Region</div><i className='fa fa-angle-right'></i></li>
                            {selectedRegion.length > 0 &&
                                <li><div className='location-option'><img src={CityIcon} alt="" />City</div><i className='fa fa-angle-right'></i></li>
                            }
                        </ul>
                    </div>
                </div>
            }
            {/*--------------- SELECT REGION ----------------------------*/}
            {selectRegionOpen &&
                <div className='ss-select-region-container'>
                    <div className="ss-select-region-row1">
                        <div className="back-arrow" onClick={toggleSelectRegionOpen}></div>
                        <span>Select Region</span>
                    </div>
                    <div className="ss-select-region-row2">
                        <ul className='region-list'>
                            {Object.keys(userLocationData).map((region) => (
                                <li
                                    key={region}
                                    value={region}
                                    onClick={() => handleRegionClick(region)}
                                    className={`${selectedRegion === region ? 'active' : ''}`}
                                >
                                    {region}
                                </li>
                            ))}
                        </ul>
                        <div className="select-region-btns">
                            <BtnClear label='Clear' disabled={selectedRegion.length === 0} onClick={clearSelectedRegion} />
                            <BtnGreen label='Apply' disabled={selectedRegion.length === 0} />
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default SmallScreenSearchByLoc
