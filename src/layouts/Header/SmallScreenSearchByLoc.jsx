import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import './style.scss'
import BtnGreen from '../../components/Button/BtnGreen';
import BtnClear from '../../components/Button/BtnClear'
import CheckBox from '../../components/FormField/CheckBox/CheckBox';
import { ReactComponent as MagnifyingGlass } from '../../assets/images/magnifying-glass.svg';
import NearLocIcon from '../../assets/images/near-loc-icon.png'
import AllPhIcon from '../../assets/images/all-ph-icon.png'
import RegionIcon from '../../assets/images/region-icon.png'
import CityIcon from '../../assets/images/city-icon.png'
import userLocationData from '../../data/userLocationData.json'
import locationData from '../../data/locationData.json'

const SmallScreenSearchByLoc = () => {

    const location = useLocation(); // <-- Use the useLocation hook
    const queryParams = new URLSearchParams(location.search);
    const [searchItemOpen, setSearchItemOpen] = useState(false)
    const [selectRegionOpen, setSelectRegionOpen] = useState(false)
    const [selectCityOpen, setSelectCityOpen] = useState(false)
    const [selectedRegion, setSelectedRegion] = useState([]);
    const [selectedCity, setSelectedCity] = useState([]);
    const [cityCheckedState, setCityCheckedState] = useState({});
    const [clickedRegion, setClickedRegion] = useState([])
    const [currentOrAllLocations, setCurrentOrAllLocations] = useState(queryParams.get('location') || 'All of the Philippines');
    const [searchFilterLocation, setSearchFilterLocation] = useState('');
    const [searchTerm, setSearchTerm] = useState(queryParams.get('keyword') || '');
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [radius, setRadius] = useState(10); // Default radius in kilometers


    const navigate = useNavigate();

    const handleSearch = () => {
        const searchParams = new URLSearchParams();

        if (latitude && longitude) {
            searchParams.append('latitude', latitude);
            searchParams.append('longitude', longitude);
            searchParams.append('radius', radius);

            navigate(`/search-results?keyword=${searchTerm}&location=${encodeURIComponent(searchFilterLocation)}&latitude=${latitude}&longitude=${longitude}&radius=${radius}`);
        } else {
            navigate(`/search-results?keyword=${searchTerm}&location=${encodeURIComponent(searchFilterLocation)}`);
        }
        setSearchItemOpen(false)
    };

    const handleKeyPress = (e) => {
        // Check if the pressed key is Enter
        if (e.key === 'Enter') {
            handleSearch();
            setSearchItemOpen(false)
        }
    };


    const toggleSearchItemOpen = () => {
        setSearchItemOpen((prevSearchItemOpen) => !prevSearchItemOpen)
    }

    const toggleSelectRegionOpen = () => {
        setSelectRegionOpen((prevSelectRegionOpen) => !prevSelectRegionOpen);
        selectedRegion.length > 0 ? setClickedRegion(selectedRegion) : setClickedRegion([]);
    }

    const toggleSelectCityOpen = () => {
        setSelectCityOpen((prevSelectCityOpen) => !prevSelectCityOpen)
        selectedCity.length > 0 ? setCityCheckedState(cityCheckedState) : setCityCheckedState({})
    }

    const handleRegionClick = (selectedRegion) => {
        setClickedRegion(selectedRegion);
    }

    const handleCityChecked = (cityName) => {
        setCityCheckedState(prevState => ({
            ...prevState,
            [cityName]: !prevState[cityName]
        }));
    }

    // Function to remove a selected city based on its index
    const removeSelectedCity = (indexToRemove, cityToRemove) => {
        // Update the cityCheckedState to uncheck the checkbox associated with the removed city
        setCityCheckedState(prevState => {
            return {
                ...prevState,
                [cityToRemove]: false  // Set the value to false for the removed city
            };
        });

        // Filter out the city at the specified index from the selectedCity state
        setSelectedCity(prevSelectedCity => {
            return prevSelectedCity.filter((_, index) => index !== indexToRemove);
        });
    };


    const removeAllSelectedCity = () => {
        setSelectedCity([]);
        setCityCheckedState({});
    }

    const applySelectedRegion = () => {
        setSelectRegionOpen((prevSelectRegionOpen) => !prevSelectRegionOpen)
        setSelectedRegion(clickedRegion)
        setSelectedCity([])
        setCityCheckedState({})
        setCurrentOrAllLocations('')
    }

    const applySelectedCity = () => {
        setSelectCityOpen(prevSelectCityOpen => !prevSelectCityOpen);

        const selectedCitiesArray = Object.entries(cityCheckedState)
            .filter(([_city, isChecked]) => isChecked)
            .map(([city]) => city);

        setSelectedCity(selectedCitiesArray);
    };



    const handleCurrentOrAllLocationsClick = (filterText) => {
        setSelectedRegion([])
        setClickedRegion([])
        setSelectedCity([])
        setCityCheckedState({})
        setCurrentOrAllLocations(filterText)
        if (filterText === 'Listings Nearby') {
            navigator.geolocation.getCurrentPosition((position) => {
              setLatitude(position.coords.latitude);
              setLongitude(position.coords.longitude);
            });
          } else {
            setLatitude(null);
            setLongitude(null);
          }
    }


    useEffect(() => {
        setSearchFilterLocation(
            selectedCity.length > 0
                ? selectedCity.join(' | ')
                : selectedRegion.length > 0
                    ? selectedRegion
                    : currentOrAllLocations
        );
    }, [selectedCity, selectedRegion, currentOrAllLocations]);


    return (
        <>
            <div className='small-screen-magnifying-glass' onClick={toggleSearchItemOpen}><MagnifyingGlass /></div>
            {searchItemOpen &&
                <div className="ss-search-location-container">
                    <div className="ss-search-location-row1">
                        <div className="back-arrow" onClick={toggleSearchItemOpen}></div>
                        <div className='search-box-container'>
                            <input
                                type='text'
                                className='search-input'
                                placeholder='Search items...'
                                value={searchTerm}
                                onKeyDown={handleKeyPress}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button onClick={handleSearch}><div className='btn-magnifying-glass'><MagnifyingGlass /></div></button>
                        </div>
                    </div>
                    <div className="ss-search-location-row2">
                        <small>Search by:</small>
                        {selectedRegion.length > 0 &&
                            <>
                                <p className='selected-region'>{selectedRegion}</p>
                                {selectedRegion.length > 0 &&
                                    <div className='selected-city-container'>
                                        {selectedCity.length > 0 ? (
                                            selectedCity.map((city, index) => (
                                                <>
                                                    <div key={index} className='selected-city'>
                                                        {city}
                                                        <div className='close-btn' onClick={() => removeSelectedCity(index, city)}>
                                                            <i className="fa fa-times"></i>
                                                        </div>
                                                    </div>
                                                    {selectedCity.length > 1 && index === selectedCity.length - 1 && (
                                                        <div className='reset-selected-cities' onClick={() => removeAllSelectedCity()}>Reset</div>
                                                    )}
                                                </>
                                            ))
                                        ) : (
                                            <p className='please-choose-city'>No city selected</p>
                                        )}
                                    </div>
                                }
                            </>
                        }
                        <ul>
                            <li
                                className={currentOrAllLocations === 'Listings Nearby' ? 'active' : ''}
                                onClick={() => handleCurrentOrAllLocationsClick('Listings Nearby')}
                            >
                                <div className='location-option'><img src={NearLocIcon} alt="" />Listings Nearby</div>
                            </li>
                            <li
                                className={currentOrAllLocations === 'All of the Philippines' ? 'active' : ''}
                                onClick={() => handleCurrentOrAllLocationsClick('All of the Philippines')}
                            >
                                <div className='location-option'><img src={AllPhIcon} alt="" />All of the Philippines</div>
                            </li>
                            <li onClick={toggleSelectRegionOpen}><div className='location-option'><img src={RegionIcon} alt="" />Region</div><i className='fa fa-angle-right'></i></li>
                            {selectedRegion.length > 0 &&
                                <li onClick={toggleSelectCityOpen}><div className='location-option'><img src={CityIcon} alt="" />City</div><i className='fa fa-angle-right'></i></li>
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
                            {Object.keys(locationData).map((region) => (
                                <li
                                    key={region}
                                    value={region}
                                    onClick={() => handleRegionClick(region)}
                                    className={`${clickedRegion === region ? 'active' : ''}`}
                                >
                                    {region}
                                </li>
                            ))}
                        </ul>
                        <div className="select-region-btns">
                            <BtnClear label='Cancel' onClick={toggleSelectRegionOpen} />
                            <BtnGreen label='Apply' disabled={clickedRegion.length === 0} onClick={applySelectedRegion} />
                        </div>
                    </div>
                </div>
            }
            {/*--------------- SELECT CITY ----------------------------*/}
            {selectCityOpen &&
                <div className='ss-select-city-container'>
                    <div className="ss-select-city-row1">
                        <div className="back-arrow" onClick={toggleSelectCityOpen}></div>
                        <span>Select City</span>
                    </div>
                    <div className="ss-select-city-row2">
                        <ul className='city-list'>
                            {selectedRegion && locationData[selectedRegion] && (
                                Object.keys(locationData[selectedRegion]).map((city) => (
                                    <li key={city}>
                                        <CheckBox
                                            label={city}
                                            value={city}
                                            checked={cityCheckedState[city] || false}
                                            onChange={() => handleCityChecked(city)}
                                        />
                                    </li>
                                ))
                            )}
                        </ul>
                        <div className="select-city-btns">
                            <BtnClear
                                label='Clear All'
                                disabled={Object.keys(cityCheckedState).length === 0 || Object.values(cityCheckedState).every(value => value === false)}
                                onClick={removeAllSelectedCity}
                            />

                            <BtnGreen
                                label='Apply'
                                disabled={Object.keys(cityCheckedState).length === 0 || Object.values(cityCheckedState).every(value => value === false)}
                                onClick={applySelectedCity}
                            />

                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default SmallScreenSearchByLoc
