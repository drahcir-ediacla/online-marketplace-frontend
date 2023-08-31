import React, { useState } from 'react';

const RangeSlider = () => {
  const [rangeValue, setRangeValue] = useState(50);

  const handleRangeChange = (event) => {
    const newValue = event.target.value;
    setRangeValue(newValue);
  };

  return (
    <>
    <div className='location-container'>
      <div className='user-location'>Location: Oranbo, Pasig, Metro Manila</div>
      <div className='slidecontainer'>
        <small>Expand Range: </small>
        <input
          type='range'
          min='1'
          max='100'
          value={rangeValue}
          className='slider'
          onChange={handleRangeChange}
        />
        <span id='demo'>{rangeValue}km</span>
      </div>
    </div>
    </>
  );
};

export default RangeSlider;
