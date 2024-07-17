import React, { useEffect, useRef, useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import HeroBanner1 from '../../assets/images/hero-banner1.webp';
import HeroBanner2 from '../../assets/images/hero-banner2.webp';
import './style.scss';

const libraries = ['places'];

const TestPage = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyCz3j-xPDm9jPy3KSzgdCZq5InfNuE3xsE', // Replace with your API key
    libraries,
  });

  const inputRef = useRef(null);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (isLoaded && !loadError) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['establishment'], // Allows landmarks like restaurants, buildings, malls, stores, schools, etc.
        componentRestrictions: { country: 'PH' },
      });
      autocompleteRef.current = autocomplete;

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

        if (!selectedPlaces.some(selectedPlace => selectedPlace.placeId === newPlace.placeId)) {
          setSelectedPlaces([...selectedPlaces, newPlace]);
        } else {
          alert('Place already selected.');
        }
      });

      const observer = new MutationObserver(() => {
        const autocompleteItems = document.querySelectorAll('.pac-item');
        autocompleteItems.forEach(item => {
          const placeId = item.getAttribute('data-place-id');
          if (selectedPlaces.some(selectedPlace => selectedPlace.placeId === placeId)) {
            item.classList.add('highlight');
          } else {
            item.classList.remove('highlight');
          }
        });
      });

      observer.observe(document.body, { childList: true, subtree: true });
    }
  }, [isLoaded, loadError, selectedPlaces]);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading Maps</div>;
  }

  return (
    <div>
      <div className="container">
        <div className='hero-banner'>
          <OwlCarousel className='owl-theme' items="1" dots>
            <div>
              <img src={HeroBanner1} alt="Hero Banner 1" />
            </div>
            <div>
              <img src={HeroBanner2} alt="Hero Banner 2" />
            </div>
          </OwlCarousel>
        </div>
      </div>
      <input ref={inputRef} type="text" placeholder="Enter a landmark in the Philippines" />
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
    </div>
  );
}

export default TestPage;
