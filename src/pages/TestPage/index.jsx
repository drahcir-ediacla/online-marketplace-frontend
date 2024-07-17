// import React, { useState, useEffect, useRef } from 'react';
// import { useLoadScript } from '@react-google-maps/api';
// import './style.scss'
// import 'owl.carousel/dist/assets/owl.carousel.css';
// import 'owl.carousel/dist/assets/owl.theme.default.css';

// const libraries = ['places'];

// function TestPage() {

//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: 'AIzaSyCz3j-xPDm9jPy3KSzgdCZq5InfNuE3xsE', // Replace with your API key
//     libraries,
//   });

//   const inputRef = useRef(null);
//   const [selectedPlace, setSelectedPlace] = useState(null);
//   const [addressComponents, setAddressComponents] = useState({});

//   useEffect(() => {
//     if (isLoaded && !loadError) {
//       const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
//         types: ['(cities)'],
//         componentRestrictions: { country: 'PH' },
//       });

//       autocomplete.addListener('place_changed', () => {
//         const place = autocomplete.getPlace();
//         if (!place.geometry) {
//           alert("No details available for input: '" + place.name + "'");
//           return;
//         }
//         setSelectedPlace(place);
//         console.log('Selected city:', place.name);

//         // Extract address components
//         const components = place.address_components.reduce((acc, component) => {
//           component.types.forEach(type => {
//             acc[type] = component.long_name;
//           });
//           return acc;
//         }, {});
//         setAddressComponents(components);
//       });
//     }
//   }, [isLoaded, loadError]);

//   if (loadError) {
//     return <div>Error loading maps</div>;
//   }

//   if (!isLoaded) {
//     return <div>Loading Maps</div>;
//   }

//   return (
//     <div>
//       <div className="container">
//         <input ref={inputRef} type="text" placeholder="Enter a city in the Philippines" />
//       </div>
//       {selectedPlace && (
//         <div>
//           <h3>Selected Place Details:</h3>
//           <p><strong>Name:</strong> {selectedPlace.name}</p>
//           <p><strong>Address:</strong> {selectedPlace.formatted_address}</p>
//           <p><strong>Location:</strong> {selectedPlace.geometry.location.lat()}, {selectedPlace.geometry.location.lng()}</p>
//           <p><strong>Administrative Area Level 1:</strong> {addressComponents.administrative_area_level_1}</p>
//           <p><strong>Locality:</strong> {addressComponents.locality}</p>
//         </div>
//       )}
//     </div>


//   );
// }

// export default TestPage;


import React from 'react';
import SellerLocationMap from '../../components/Map/SellerLocationMap';

const MapWithMarkerAndCircle = () => {

  const center = { lat: 14.6016, lng: 121.031 };

  return (
    <>
      <SellerLocationMap center={center} radiusInMeters='100' />
    </>

  );
};

export default MapWithMarkerAndCircle;
