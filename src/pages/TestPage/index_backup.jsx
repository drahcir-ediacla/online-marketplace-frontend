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
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    if (isLoaded && !loadError) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['establishment'],
        componentRestrictions: { country: 'PH' },
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          alert("No details available for input: '" + place.name + "'");
          return;
        }
        setSelectedPlace(place);
      });
    }
  }, [isLoaded, loadError]);

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
      <input ref={inputRef} type="text" placeholder="Enter a city in the Philippines" />
      {selectedPlace && (
        <div>
          <h3>Selected Place Details:</h3>
          <p><strong>Name:</strong> {selectedPlace.name}</p>
          <p><strong>Address:</strong> {selectedPlace.formatted_address}</p>
          <p><strong>Location:</strong> {selectedPlace.geometry.location.lat()}, {selectedPlace.geometry.location.lng()}</p>
        </div>
      )}
    </div>
  );
}

export default TestPage;




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
