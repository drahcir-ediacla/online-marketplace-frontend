import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckBox from '../../components/FormField/CheckBox/CheckBox'
import { ReactComponent as LocationIcon } from '../../assets/images/location-icon.svg'
import { ReactComponent as MagnifyingGlass } from '../../assets/images/magnifying-glass.svg';
import NearLocIcon from '../../assets/images/near-loc-icon.png'
import AllPhIcon from '../../assets/images/all-ph-icon.png'
import RegionIcon from '../../assets/images/region-icon.png'
import CityIcon from '../../assets/images/city-icon.png'

const HeaderSearchBox = () => {

  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All of the Philippines');
  const [selectedRegions, setSelectedRegions] = useState([]);
  const filterBoxRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/search-results?name=${searchTerm}`);
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

  const handleFilterItemClick = (filterText) => {
    if (filterText === 'Listing Near Me' || filterText === 'All of the Philippines') {
      setSelectedFilter(filterText);
    } else {
      if (selectedRegions.includes(filterText)) {
        setSelectedRegions(selectedRegions.filter(item => item !== filterText));
      } else {
        setSelectedRegions([...selectedRegions, filterText]);
      }
    }
    setShowFilterOptions(true);
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
          <input type="text" id='filterBox' placeholder='All of the Philippines' value={selectedRegions.length > 0 ? selectedRegions.join(', ') : selectedFilter} onFocus={handleInputFocus} readOnly />
          <div className='location-icon'><LocationIcon /></div>
          <button onClick={handleSearch}><div className='magnifying-glass'><MagnifyingGlass /></div></button>
          {showFilterOptions && (
            <div className='filter-list-option'>
              <small>Search by:</small>
              <ul>
                <li onClick={() => handleFilterItemClick('Listing Near Me')}><div className='icon'><img src={NearLocIcon} alt="" />Listing Near Me</div></li>
                <li onClick={() => handleFilterItemClick('All of the Philippines')}><div className='icon'><img src={AllPhIcon} alt="" />All of the Philippines</div></li>
                <li className='region'><div className='icon'><img src={RegionIcon} alt="" />Region</div><i className='fa fa-angle-right'></i>
                  <ul className='region-list'>
                    <li checked={selectedRegions.includes('ILOCOS')} onChange={() => handleFilterItemClick('ILOCOS')}><CheckBox label='Ilocos Region' value='ilocos' /></li>
                    <li checked={selectedRegions.includes('Cagayan')} onChange={() => handleFilterItemClick('Cagayan')}><CheckBox label='Cagayan Valley' value='Cagayan' /></li>
                    <li checked={selectedRegions.includes('Central Luzon')} onChange={() => handleFilterItemClick('Central Luzon')}><CheckBox label='Central Luzon' value='Central Luzon' /></li>
                    <li checked={selectedRegions.includes('Metro Manila')} onChange={() => handleFilterItemClick('Metro Manila')}><CheckBox label='Metro Manila' value='Metro Manila' /></li>
                    <li checked={selectedRegions.includes('CALABARZON')} onChange={() => handleFilterItemClick('CALABARZON')}><CheckBox label='CALABARZON' value='CALABARZON' /></li>
                    <li checked={selectedRegions.includes('MIMAROPA')} onChange={() => handleFilterItemClick('MIMAROPA')}><CheckBox label='MIMAROPA' value='MIMAROPA' /></li>
                    <li checked={selectedRegions.includes('Bicol Region')} onChange={() => handleFilterItemClick('Bicol Region')}><CheckBox label='Bicol Region' value='Bicol Region' /></li>
                    <li checked={selectedRegions.includes('Western Visayas')} onChange={() => handleFilterItemClick('Western Visayas')}><CheckBox label='Western Visayas' value='Western Visayas' /></li>
                    <li checked={selectedRegions.includes('Central Visayas')} onChange={() => handleFilterItemClick('Central Visayas')}><CheckBox label='Central Visayas' value='Central Visayas' /></li>
                    <li checked={selectedRegions.includes('Eastern Visayas')} onChange={() => handleFilterItemClick('Eastern Visayas')}><CheckBox label='Eastern Visayas' value='Eastern Visayas' /></li>
                    <li checked={selectedRegions.includes('Zamboanga Peninsula')} onChange={() => handleFilterItemClick('Zamboanga Peninsula')}><CheckBox label='Zamboanga Peninsula' value='Zamboanga Peninsula' /></li>
                    <li checked={selectedRegions.includes('Northern Mindanao')} onChange={() => handleFilterItemClick('Northern Mindanao')}><CheckBox label='Northern Mindanao' value='Northern Mindanao' /></li>
                    <li checked={selectedRegions.includes('Davao Region')} onChange={() => handleFilterItemClick('Davao Region')}><CheckBox label='Davao Region' value='Davao Region' /></li>
                    <li checked={selectedRegions.includes('SOCCSKSARGEN')} onChange={() => handleFilterItemClick('SOCCSKSARGEN')}><CheckBox label='SOCCSKSARGEN' value='SOCCSKSARGEN' /></li>
                    <li checked={selectedRegions.includes('Caraga')} onChange={() => handleFilterItemClick('Caraga')}><CheckBox label='Caraga' value='Caraga' /></li>
                    <li checked={selectedRegions.includes('CAR')} onChange={() => handleFilterItemClick('CAR')}><CheckBox label='CAR' value='CAR' /></li>
                    <li checked={selectedRegions.includes('BARMM')} onChange={() => handleFilterItemClick('BARMM')}><CheckBox label='BARMM' value='BARMM' /></li>
                  </ul>
                </li>
                <li>
                  <div className='icon'><img src={CityIcon} alt="" />City</div><i className='fa fa-angle-right'></i>
                </li>
              </ul>
            </div>
          )}

        </div>
      </div>
    </>
  )
}

export default HeaderSearchBox
