import React, { useState, useEffect } from 'react';
import './style.scss';
import { ReactComponent as HeartRegular } from '../../assets/images/heart-regular.svg';
import { ReactComponent as HeartSolid } from '../../assets/images/heart-solid.svg';

const WishlistButton = ({ data, addToWishlist, removeFromWishlist, userId, wishlistCount, setWishlistCount, getWishlistCount }) => {
  const [productStates, setProductStates] = useState({});

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
      <div className='wishlist-counter'>{wishlistCount[data.id] || ''}</div>
      <button onClick={() => handleWishlistClick(data.id)} className='heart-icon'>
        {productStates[data.id] ? <HeartSolid /> : <HeartRegular />}
      </button>
    </div>
  );
};

export default WishlistButton;
