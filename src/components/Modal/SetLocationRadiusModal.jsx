import React, { useState, useEffect } from 'react';
import './style.scss'
import UserLocationMap from '../Map/UserLocationMap';
import BtnClear from '../Button/BtnClear';
import BtnGreen from '../Button/BtnGreen'

const LocationRadiusModal = ({ onClick, onRadiusChange, currentRadius, latitude, longitude, placeName }) => {

    
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [radiusInKilometers, setRadiusInKilometers] = useState(currentRadius)
    
    const center = { lat: latitude, lng: longitude }; // Example coordinates (San Francisco)

    const handleRangeChange = (event) => {
        const newValue = event.target.value;
        setRadiusInKilometers(newValue);
    };

    const applyRadius = () => {
        onRadiusChange(radiusInKilometers);
    }


    useEffect(() => {
        // Update body overflow based on isMenuOpen
        document.body.style.overflow = isModalOpen ? 'hidden' : 'auto';
        // Cleanup the effect
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isModalOpen]);



    return (
        <>
            {isModalOpen &&
                <div className="modal-container">
                    <div className="modal-box">
                        <div className='location-radius-row1'>
                            <button className='closebtn' onClick={onClick}>
                                <i class='fa fa-times'></i>
                            </button>
                        </div>
                        <div className='modal-box-title'>
                            <h5>SET DISTANCE RADIUS</h5>
                            <span>Your current location is: </span><span className='current-location'>{placeName}</span>
                        </div>
                        <dvi>
                            <UserLocationMap center={center} radiusInKilometers={radiusInKilometers} />
                        </dvi>
                        <div className='slidecontainer'>
                            <input
                                type='range'
                                min='1'
                                max='100'
                                value={radiusInKilometers}
                                className='slider'
                                onChange={handleRangeChange}
                            />
                            <span id='demo'>{radiusInKilometers}km</span>
                        </div>
                        <div className='buttons'>
                            <BtnGreen label='Apply' onClick={() => { applyRadius(); onClick(); }} className='apply-btn' />
                        </div>
                    </div>
                </div>
            }
        </>
    )
}


export default LocationRadiusModal