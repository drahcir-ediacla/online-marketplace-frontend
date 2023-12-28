import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckBox from '../../components/FormField/CheckBox/CheckBox'
import { ReactComponent as LocationIcon } from '../../assets/images/location-icon.svg'
import { ReactComponent as MagnifyingGlass } from '../../assets/images/magnifying-glass.svg';
import NearLocIcon from '../../assets/images/near-loc-icon.png'
import AllPhIcon from '../../assets/images/all-ph-icon.png'
import RegionIcon from '../../assets/images/region-icon.png'
import CityIcon from '../../assets/images/city-icon.png'
import userLocationData from '../../data/userLocationData.json'

const HeaderSearchBox = () => {

  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All of the Philippines');
  const [selectedRegion, setSelectedRegion] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);
  const [cityCheckedState, setCityCheckedState] = useState({});
  const filterBoxRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/search-results?keyword=${searchTerm}`);
  };

  const handleKeyPress = (e) => {
    // Check if the pressed key is Enter
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInputFocus = () => {
    setShowFilterOptions(true);
  };


  const handleFilterItemClick = (filterText, cityName) => {
  
    setCityCheckedState(prevState => ({
      ...prevState,
      [cityName]: !prevState[cityName]
    }));
  
    // Resetting selectedRegion and selectedCity if either 'Listing Near Me' or 'All of the Philippines' is selected
    if (filterText === 'Listing Near Me' || filterText === 'All of the Philippines') {
      setSelectedRegion([]);  // Reset selectedRegion
      setSelectedCity([]);    // Reset selectedCity
      setSelectedFilter(filterText);
      setCityCheckedState({}); // Reset checkbox for all cities
    } else {
      if (selectedCity.includes(filterText)) {
        setSelectedCity(selectedCity.filter(item => item !== filterText));
      } else {
        setSelectedCity([...selectedCity, filterText]);
      }
    }
  
    setShowFilterOptions(true);
  };

  const handleRegionClick = (selectedRegion) => {
    setSelectedRegion(selectedRegion);
    setSelectedCity([]);
    setCityCheckedState({});
  }

  const handleRegionChange = (event) => {
    const selectedRegion = event.target.value;
    setSelectedRegion(selectedRegion);
    setSelectedCity('');
  };

  const handleCityChange = (event) => {
    const selectedCity = event.target.value;
    setSelectedCity(selectedCity);
  };



  useEffect(() => {
    const handleGlobalClick = event => {
      if (filterBoxRef.current && !filterBoxRef.current.contains(event.target)) {
        setShowFilterOptions(false);
      }
    };

    document.addEventListener('click', handleGlobalClick);

    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  return (
    <>
      <div className='search-container'>
        <div className='search-box'>
          <input
            type="text"
            placeholder='Search for an item...'
            value={searchTerm}
            onKeyDown={handleKeyPress}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className='filter-box' ref={filterBoxRef}>
          <input type="text" id='filterBox' placeholder='All of the Philippines' value={selectedCity.length > 0 ? selectedCity.join(' | ') : selectedFilter} onFocus={handleInputFocus} readOnly />
          <div className='location-icon'><LocationIcon /></div>
          <button onClick={handleSearch}><div className='magnifying-glass'><MagnifyingGlass /></div></button>
          {showFilterOptions && (
            <div className='filter-list-option'>
              <small>Search by:</small>
              <p className='selected-region'>{selectedRegion}</p>
              {selectedRegion.length > 0 &&
                <div className='selected-city-container'>
                  {selectedCity.length > 0 ? (
                    selectedCity.map((region, index) => (
                      <div key={index} className='selected-city'>
                        {region}
                        <div className='close-btn'>
                          <i className="fa fa-times"></i>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className='please-choose-city'>Please choose city</p>
                  )}
                </div>
              }
              <ul>
                <li onClick={() => handleFilterItemClick('Listing Near Me')}><div className='icon'><img src={NearLocIcon} alt="" />Listing Near Me</div></li>
                <li onClick={() => handleFilterItemClick('All of the Philippines')}><div className='icon'><img src={AllPhIcon} alt="" />All of the Philippines</div></li>
                <li className='region'>
                  <div className='icon'><img src={RegionIcon} alt="" />Region</div><i className='fa fa-angle-right'></i>
                  <ul className='region-list'>
                    {Object.keys(userLocationData).map((region) => (
                      <li
                        key={region}
                        value={region}
                        onClick={() => handleRegionClick(region)}
                        onChange={handleRegionChange}
                        style={{ background: selectedRegion === region ? 'var(--gray-200)' : 'initial' }}
                      >
                        {region}
                      </li>
                    ))}
                  </ul>
                </li>
                {selectedRegion.length > 0 &&
                  <li className='city'>
                    <div className='icon'><img src={CityIcon} alt="" />City</div><i className='fa fa-angle-right'></i>
                    <ul className='city-list'>
                      {selectedRegion && Array.isArray(userLocationData[selectedRegion]) && (
                        userLocationData[selectedRegion].map((city) => (
                          <li key={city}>
                            <CheckBox
                              label={city}
                              value={city}
                              checked={cityCheckedState[city] || false}
                              onChange={() => handleFilterItemClick(city, city)}
                            />
                          </li>
                        ))
                      )}
                    </ul>
                  </li>
                }
              </ul>
            </div>
          )}

        </div>
      </div>
    </>
  )
}

export default HeaderSearchBox