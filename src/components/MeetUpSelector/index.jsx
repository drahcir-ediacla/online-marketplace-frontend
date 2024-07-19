import React, { useEffect, useRef, useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import './style.scss';

const libraries = ['places'];
const MAX_SELECTED_PLACES = 5;

const MeetUpSelector = ({ onSelectedPlacesChange, fetchedMeetupPlaces }) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Replace with your API key
        libraries,
    });

    const inputRef = useRef(null);
    const [userInput, setUserInput] = useState('');
    const [selectedPlaces, setSelectedPlaces] = useState([]);
    const [selectedPlaceIds, setSelectedPlaceIds] = useState(new Set());
    const autocompleteRef = useRef(null);
    const autocompleteServiceRef = useRef(null);

    // Update state when fetchedMeetupPlaces changes
    useEffect(() => {
        setSelectedPlaces(fetchedMeetupPlaces || []);
        setSelectedPlaceIds(new Set((fetchedMeetupPlaces || []).map(p => p.placeId)));
    }, [fetchedMeetupPlaces]);

    useEffect(() => {
        if (isLoaded && !loadError) {
            const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
                types: ['establishment'], // Allows landmarks like restaurants, buildings, malls, stores, schools, etc.
                componentRestrictions: { country: 'PH' },
            });
            autocompleteRef.current = autocomplete;
            autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();

            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (!place.geometry) {
                    alert("No details available for input: '" + place.name + "'");
                    return;
                }

                const components = place.address_components.reduce((acc, component) => {
                    component.types.forEach(type => {
                        acc[type] = component.long_name;
                    });
                    return acc;
                }, {});

                const newPlace = {
                    placeId: place.place_id,
                    name: place.name,
                    address: place.formatted_address,
                    latitude: place.geometry.location.lat(),
                    longitude: place.geometry.location.lng(),
                    administrativeAreaLevel1: components.administrative_area_level_1 || '',
                    locality: components.locality || '',
                };

                let updatedPlaces;
                if (selectedPlaceIds.has(newPlace.placeId)) {
                    // Remove the place if it is already selected
                    updatedPlaces = selectedPlaces.filter(p => p.placeId !== newPlace.placeId);
                    setSelectedPlaces(updatedPlaces);
                    setSelectedPlaceIds(new Set(updatedPlaces.map(p => p.placeId)));
                } else {
                    // Add the new place if the limit is not reached
                    if (selectedPlaces.length < MAX_SELECTED_PLACES) {
                        updatedPlaces = [...selectedPlaces, newPlace];
                        setSelectedPlaces(updatedPlaces);
                        setSelectedPlaceIds(new Set([...selectedPlaceIds, newPlace.placeId]));
                    } else {
                        alert(`You can only select up to ${MAX_SELECTED_PLACES} places.`);
                        return;
                    }
                }

                // Notify the parent component of the change
                onSelectedPlacesChange(updatedPlaces);

                // Restore user input to the input field
                setTimeout(() => {
                    inputRef.current.value = userInput;
                });
            });

            const observer = new MutationObserver(() => {
                const autocompleteItems = document.querySelectorAll('.pac-item');
                const inputValue = inputRef.current?.value;

                if (inputValue) {
                    autocompleteServiceRef.current.getPlacePredictions(
                        { input: inputValue, types: ['establishment'], componentRestrictions: { country: 'PH' } },
                        (predictions) => {
                            autocompleteItems.forEach(item => {
                                const description = item.querySelector('.pac-item-query')?.textContent || '';
                                const prediction = predictions.find(pred => pred.description.includes(description));
                                if (prediction && selectedPlaces.some(selectedPlace => selectedPlace.placeId === prediction.place_id)) {
                                    item.classList.add('highlight');
                                } else {
                                    item.classList.remove('highlight');
                                }
                            });
                        }
                    );
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });

            // Cleanup observer on component unmount
            return () => observer.disconnect();
        }
    }, [isLoaded, loadError, selectedPlaces, selectedPlaceIds, userInput]);

    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };

    const handleRemovePlace = (placeId) => {
        const updatedPlaces = selectedPlaces.filter(p => p.placeId !== placeId);
        setSelectedPlaces(updatedPlaces);
        setSelectedPlaceIds(new Set(updatedPlaces.map(p => p.placeId)));
        onSelectedPlacesChange(updatedPlaces);
    };

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    if (!isLoaded) {
        return <div>Loading Maps</div>;
    }

    return (
        <>
            <input ref={inputRef} type="text" value={userInput} placeholder="Type meetup locations" className='input-meetup-locations' onChange={handleInputChange} />
            {selectedPlaces.length > 0 && (
                <div className='selected-places-container'>
                    {selectedPlaces.map((place, index) => (
                        <div key={index} className="selected-place">
                            <div className='selected-place-row1'>
                                <h6>{place.name}</h6>
                                <button className="delete-place-btn" type='button' onClick={() => handleRemovePlace(place.placeId)}><i className="fa fa-times"></i></button>
                            </div>
                            <p>{place.address}</p>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default MeetUpSelector;
