import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './style.scss';
import { ReactComponent as HeartRegular } from '../../assets/images/heart-regular.svg';
import { ReactComponent as HeartSolid } from '../../assets/images/heart-solid.svg';

const WishlistButton = ({ data, addToWishlist, removeFromWishlist, userId, wishlistCount, setWishlistCount, getWishlistCount }) => {
  
  const [productStates, setProductStates] = useState({});
  const [showSignInMessage, setShowSignInMessage] = useState({});
  const signInRef = useRef(null);


  useEffect(() => {
    // Function to handle clicks outside the add-wishlist-sign-in element
    const handleClickOutside = (event) => {
      if (signInRef.current && !signInRef.current.contains(event.target)) {
        // Hide the sign-in message for all products when clicked outside
        setShowSignInMessage({});
      }
    };

    // Add event listener to detect clicks on the document
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup: Remove event listener when component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Initialize productStates based on initial wishlist data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if data has wishlist property
        if (data.wishlist) {
          // Set productStates after fetching data
          const isProductInWishlist = Array.isArray(data.wishlist) && data.wishlist.some((entry) => String(entry.user_id) === String(userId));
          setProductStates({ [data.id]: isProductInWishlist });
        } else {
          console.error('Invalid data. Expected wishlist property:', data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [data, userId]);

  // Check if data is null or undefined
  if (!data || typeof data !== 'object') {
    return null; // or return some default content or loading indicator
  }

  const handleWishlistClick = async (productId) => {
    try {
      const isAdded = productStates[productId] || false;

      if (!userId) { // If user is not authenticated
        setShowSignInMessage(prevState => ({
          ...prevState,
          [productId]: !prevState[productId], // Toggle the sign-in message for this specific product
        }));
        return; // Exit the function without adding/removing from wishlist
      }

      if (isAdded) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }

      // Update the local state immediately after the action is dispatched
      setProductStates((prevStates) => ({
        ...prevStates,
        [productId]: !prevStates[productId],
      }));

      // Update wishlist count for the product after state changes
      const updatedWishlistCount = getWishlistCount(productId);

      // Set the updated wishlist count
      setWishlistCount({ [productId]: updatedWishlistCount });
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  return (
    <div className='wishlist-container'>
      {showSignInMessage[data.id] && !userId && (
                <div ref={signInRef} className='add-wishlist-sign-in'>
                  <h6>You like this item?</h6>
                  <p>Sign in to add this item to your wishlist</p>
                  <Link to={'/loginemail'}>Sign in</Link>
                </div>
                )}
      <div className='wishlist-counter'>{wishlistCount[data.id] || ''}</div>
      <button onClick={() => handleWishlistClick(data.id)} className='heart-icon'>
        {productStates[data.id] ? <HeartSolid /> : <HeartRegular />}
      </button>
    </div>
  );
};

export default WishlistButton;
