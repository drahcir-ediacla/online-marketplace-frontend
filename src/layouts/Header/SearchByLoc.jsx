import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CheckBox from '../../components/FormField/CheckBox/CheckBox'
import { ReactComponent as LocationIcon } from '../../assets/images/location-icon.svg'
import { ReactComponent as MagnifyingGlass } from '../../assets/images/magnifying-glass.svg';
import { ReactComponent as NearbyIcon } from '../../assets/images/nearby-icon.svg';
import NearLocIcon from '../../assets/images/near-loc-icon.png'
import AllPhIcon from '../../assets/images/all-ph-icon.png'
import RegionIcon from '../../assets/images/region-icon.png'
import CityIcon from '../../assets/images/city-icon.png'
import locationData from '../../data/locationData.json'
import AlertMessage from '../../components/AlertMessage';

const HeaderSearchBox = ({ radius, placeName, setPlaceName }) => {
  const location = useLocation(); // <-- Use the useLocation hook
  const queryParams = new URLSearchParams(location.search);
  // const [initialLocation, setInitialLocation] = useState(queryParams.get('location')); // <-- Extract location from query params
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(queryParams.get('location') || 'All of the Philippines');
  const [selectedRegion, setSelectedRegion] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);
  const [cityCheckedState, setCityCheckedState] = useState({});
  const filterBoxRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState(queryParams.get('keyword') || '');
  const [searchFilterLocation, setSearchFilterLocation] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedFilter === 'Listings Nearby') {
      navigator.geolocation.getCurrentPosition((position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      });
    }
  }, [])

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

  const getPlaceName = async (latitude, longitude) => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY; // Replace with your actual API key
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    try {
      const response = await fetch(geocodeUrl);
      const data = await response.json();
      if (data.status === 'OK') {
        const placeRoute = data.results[0].address_components[1].long_name;
        const placeLocality = data.results[0].address_components[2].long_name;
        setPlaceName(`${placeRoute}, ${placeLocality}`)
        // Do something with the place name
      } else {
        console.error('Geocoding error:', data.status);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const handleFilterItemClick = (filterText, cityName) => {
    setShowAlert(false)
    setCityCheckedState(prevState => ({
      ...prevState,
      [cityName]: !prevState[cityName]
    }));

    // Store the current search filter location
    const currentSearchFilterLocation = searchFilterLocation;
    const currentSelectedFilter = selectedFilter;

    // Resetting selectedRegion and selectedCity if either 'Listing Nearby' or 'All of the Philippines' is selected
    if (filterText === 'Listings Nearby' || filterText === 'All of the Philippines') {
      setSelectedRegion([]);  // Reset selectedRegion
      setSelectedCity([]);    // Reset selectedCity
      setSelectedFilter(filterText);
      setCityCheckedState({}); // Reset checkbox for all cities

      if (filterText === 'Listings Nearby') {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
            getPlaceName(position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            // Handle error case
            switch (error.code) {
              case error.PERMISSION_DENIED:
                setErrMsg("You denied Yogeek to use your current location.");
                break;
              case error.POSITION_UNAVAILABLE:
                setErrMsg("Location information is unavailable.");
                break;
              case error.TIMEOUT:
                setErrMsg("The request to get user location timed out.");
                break;
              case error.UNKNOWN_ERROR:
                setErrMsg("An unknown error occurred.");
                break;
            }
            setSearchFilterLocation(currentSearchFilterLocation);
            setSelectedFilter(currentSelectedFilter)
            setShowAlert(true)
          }
        );
      } else {
        setLatitude(null);
        setLongitude(null);
      }
    } else {
      if (selectedCity.includes(cityName)) {
        setSelectedCity(prevSelectedCity => prevSelectedCity.filter(city => city !== cityName));
      } else {
        setSelectedCity(prevSelectedCity => [...prevSelectedCity, cityName]);
      }
    }
    setShowFilterOptions(true);
  };

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
    setShowFilterOptions(true);
  };


  const removeAllSelectedCity = () => {
    setSelectedCity([]);
    setCityCheckedState({});
    setShowFilterOptions(true);
  }


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


  useEffect(() => {
    setSearchFilterLocation(
      selectedCity.length > 0
        ? selectedCity.join(' | ')
        : selectedRegion.length > 0
          ? selectedRegion
          : selectedFilter
    );
  }, [selectedCity, selectedRegion, selectedFilter]);


  return (
    <>
      {showAlert && <AlertMessage type="error" message={errMsg} className='alert-box' />}
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
          <input
            type="text"
            id='filterBox'
            placeholder='All of the Philippines'
            value={searchFilterLocation}
            onFocus={handleInputFocus}
            onChange={(e) => setSearchFilterLocation(e.target.value)}
            readOnly
          />
          {searchFilterLocation === 'Listings Nearby' ? (
            <div className='nearby-icon'>
              <NearbyIcon />
            </div>
          ) : (
            <div className='location-icon'>
              <LocationIcon />
            </div>
          )}
          <button onClick={handleSearch}><div className='magnifying-glass'><MagnifyingGlass /></div></button>
          {showFilterOptions && (
            <div className='filter-list-option'>
              <small>Search by:</small>
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
              <ul>
                <li onClick={() => handleFilterItemClick('Listings Nearby')}><div className='icon'><img src={NearLocIcon} alt="" />Listings Nearby</div></li>
                <li onClick={() => handleFilterItemClick('All of the Philippines')}><div className='icon'><img src={AllPhIcon} alt="" />All of the Philippines</div></li>
                <li className='region'>
                  <div className='icon'><img src={RegionIcon} alt="" />Region</div><i className='fa fa-angle-right'></i>
                  <ul className='region-list'>
                    {Object.keys(locationData).map((region) => (
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
                      {selectedRegion && locationData[selectedRegion] &&
                        Object.keys(locationData[selectedRegion]).map((city) => (
                          <li key={city}>
                            <CheckBox
                              label={city}
                              value={city}
                              checked={cityCheckedState[city] || false}
                              onChange={() => handleFilterItemClick(city, city)}
                            />
                          </li>
                        ))
                      }
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