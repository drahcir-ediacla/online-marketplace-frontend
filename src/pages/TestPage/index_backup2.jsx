import React, { useState } from 'react';
import axios from 'axios';

const AddProductForm = () => {
  const [productDetails, setProductDetails] = useState({
    product_name: '',
    description: '',
    price: '',
    category_id: '',
    product_condition: '',
    mailing_delivery: '',
    youtube_link: '',
    status: '',
  });

  const [meetupLocations, setMeetupLocations] = useState([{
    name: '',
    address: '',
    latitude: '',
    longitude: '',
  }]);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleMeetupChange = (index, e) => {
    const { name, value } = e.target;
    const newMeetupLocations = [...meetupLocations];
    newMeetupLocations[index][name] = value;
    setMeetupLocations(newMeetupLocations);
  };

  const addMeetupLocation = () => {
    setMeetupLocations([
      ...meetupLocations,
      { name: '', address: '', latitude: '', longitude: '' }
    ]);
  };

  const removeMeetupLocation = (index) => {
    const newMeetupLocations = meetupLocations.filter((_, i) => i !== index);
    setMeetupLocations(newMeetupLocations);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Check if the title is provided and meets the minimum length requirement
    if (!productDetails.product_name) {
      alert('Please enter a title for your listing.');
      return;
    } else if (productDetails.product_name.length < 5) {
      alert('Title must be at least 5 characters long.');
      return;
    }

    // Check if the price is a positive number
    if (!productDetails.price || isNaN(productDetails.price) || productDetails.price <= 0) {
      alert('Please enter a valid price for your listing.');
      return;
    }

    

    // Combine product details with meetup locations
    const productDetailsWithMeetups = {
      ...productDetails,
      meetup_locations: meetupLocations,
    };

    // Send the form data (including image URLs and meetup locations) to your backend
    axios.post('/api/addnewproduct', productDetailsWithMeetups)
      .then((response) => {
        console.log('Product added successfully:', response.data);

        const productId = response.data.id;
        const productName = response.data.product_name;
        window.location.href = `/addlistingsuccess/${productId}/${encodeURIComponent(productName)}`;
        
      })
      .catch((error) => {
        console.error('Error adding the product:', error);
      });
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        name="product_name"
        placeholder="Product Name"
        value={productDetails.product_name}
        onChange={handleInputChange}
        required
      />
      {/* Other form fields for product details */}

      <h3>Meetup Locations</h3>
      {meetupLocations.map((location, index) => (
        <div key={index}>
          <input
            type="text"
            name="name"
            placeholder="Meetup Location Name"
            value={location.name}
            onChange={(e) => handleMeetupChange(index, e)}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Meetup Address"
            value={location.address}
            onChange={(e) => handleMeetupChange(index, e)}
          />
          <input
            type="number"
            name="latitude"
            placeholder="Latitude"
            step="any"
            value={location.latitude}
            onChange={(e) => handleMeetupChange(index, e)}
            required
          />
          <input
            type="number"
            name="longitude"
            placeholder="Longitude"
            step="any"
            value={location.longitude}
            onChange={(e) => handleMeetupChange(index, e)}
            required
          />
          {meetupLocations.length > 1 && (
            <button type="button" onClick={() => removeMeetupLocation(index)}>Remove</button>
          )}
        </div>
      ))}
      <button type="button" onClick={addMeetupLocation}>Add Another Meetup Location</button>

      <button type="submit">Add Product</button>
    </form>
  );
};

export default AddProductForm;
