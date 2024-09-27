import React, { useEffect, useRef, useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import './style.scss';
import Input from '../FormField/Input';

const libraries = ['places'];

const MeetUpSelector = () => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Replace with your API key
        libraries,
    });

    const inputRef = useRef(null);
    const [userInput, setUserInput] = useState('');
    const [selectedPlaces, setSelectedPlaces] = useState([]);
    const [selectedPlaceIds, setSelectedPlaceIds] = useState(new Set()); // Store selected place IDs
    const autocompleteRef = useRef(null);
    const autocompleteServiceRef = useRef(null);

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
                    location: {
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng(),
                    },
                    administrativeAreaLevel1: components.administrative_area_level_1 || '',
                    locality: components.locality || '',
                };

                if (selectedPlaceIds.has(newPlace.placeId)) {
                    // Remove the place if it is already selected
                    const updatedPlaces = selectedPlaces.filter(p => p.placeId !== newPlace.placeId);
                    setSelectedPlaces(updatedPlaces);
                    setSelectedPlaceIds(new Set(updatedPlaces.map(p => p.placeId)));
                } else {
                    // Add the new place
                    setSelectedPlaces([...selectedPlaces, newPlace]);
                    setSelectedPlaceIds(new Set([...selectedPlaceIds, newPlace.placeId]));
                }

                // Restore user input to the input field
                setTimeout(() => {
                    inputRef.current.value = userInput;
                });
            });

            const observer = new MutationObserver(() => {
                const autocompleteItems = document.querySelectorAll('.pac-item');
                const inputValue = inputRef.current.value;

                if (inputValue) {
                    autocompleteServiceRef.current.getPlacePredictions(
                        { input: inputValue, types: ['establishment'], componentRestrictions: { country: 'PH' } },
                        (predictions) => {
                            autocompleteItems.forEach(item => {
                                const description = item.querySelector('.pac-item-query').textContent;
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
        }
    }, [isLoaded, loadError, selectedPlaces, selectedPlaceIds, userInput]);

    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    if (!isLoaded) {
        return <div>Loading Maps</div>;
    }

    return (
        <>
            <input ref={inputRef} type="text" value={userInput} placeholder="Add meetup locations" className='input-meetup-locations' onChange={handleInputChange} />
            <div>
                {selectedPlaces.length > 0 && (
                    <div>
                        <h3>Selected Places:</h3>
                        {selectedPlaces.map((place, index) => (
                            <div key={index} className="selected-place">
                                <p><strong>Name:</strong> {place.name}</p>
                                <p><strong>Address:</strong> {place.address}</p>
                                <p><strong>Location:</strong> {place.location.lat}, {place.location.lng}</p>
                                <p><strong>Administrative Area Level 1:</strong> {place.administrativeAreaLevel1}</p>
                                <p><strong>Locality:</strong> {place.locality}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default MeetUpSelector;





// import React from 'react';
// import SellerLocationMap from '../../components/Map/SellerLocationMap';

// const MapWithMarkerAndCircle = () => {

//   const center = { lat: 14.6016, lng: 121.031 };

//   return (
//     <>
//       <SellerLocationMap center={center} radiusInMeters='100' />
//     </>

//   );
// };

// export default MapWithMarkerAndCircle;



// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from '../../apicalls/axios'
// import PostList from './PostList';


// const App = () => {
//   const { discussionId } = useParams();
//   const [posts, setPosts] = useState([]);


//   useEffect(() => {
//     // Fetch posts for this discussion from API
//     const fetchPosts = async () => {
//       const response = await axios.get(`/api/discussions/${discussionId}`);
//       setPosts(response.data);
//     };

//     fetchPosts();
//   }, [discussionId]);





//   return (
//     <div>
//       <h1>Community Forum</h1>
//       <PostList posts={posts} discussionId={discussionId} />
//     </div>
//   );
// };

// export default App;
