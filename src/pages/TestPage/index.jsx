import React, { useState } from 'react';
import DependentSelect from '../../components/FormField/DependentSelect';
import userLocationData from '../../data/userLocationData.json'

const DependentDropdown = () => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  // const data = {
  //   "USA": ["New York", "Los Angeles", "Chicago"],
  //   "Canada": ["Toronto", "Vancouver", "Montreal"],
  //   "UK": ["London", "Manchester", "Liverpool"],
  // };

  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
    setSelectedCity('');
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  return (
    <div>
      <DependentSelect
        id="regionID"
        name='region'
        value={selectedRegion}
        data={Object.keys(userLocationData)}
        defaultOption="Select your region --"
        onChange={handleRegionChange}
      />

      <DependentSelect
        id="cityID"
        name='city'
        value={selectedCity}
        data={selectedRegion ? userLocationData[selectedRegion] : []}
        defaultOption="Select your city --"
        noOptionCaption="Please choose your region first --"
        onChange={handleCityChange}
      />
    </div>
  );
};

export default DependentDropdown;
