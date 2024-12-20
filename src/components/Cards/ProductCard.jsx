import React, { useState, useEffect, useRef } from 'react'
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Link } from 'react-router-dom'
import './style.scss'
import LoginModal from '../Modal/LoginModal';
import { ReactComponent as ClockIcon } from '../../assets/images/clock-regular.svg'
import { ReactComponent as HeartRegular } from '../../assets/images/heart-regular.svg';
import { ReactComponent as HeartSolid } from '../../assets/images/heart-solid.svg';
import NoImage from '../../assets/images/no-image-available.png'

const ProductCard = ({ data, addToWishlist, removeFromWishlist, userId, wishlistCount, setWishlistCount, getWishlistCount }) => {


  const [productStates, setProductStates] = useState({});
  const [showSignInMessage, setShowSignInMessage] = useState({});
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const signInRef = useRef(null);

  useEffect(() => {
    // Function to handle clicks outside the add-wishlist-sign-in element
    const handleClickOutside = (event) => {
      if (signInRef.current && !signInRef.current.contains(event.target) && !event.target.classList.contains('heart-icon')) {
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
        // ... (fetching data logic)

        // Set productStates after fetching data
        const initialProductStates = {};
        data.forEach((product) => {
          const isProductInWishlist = Array.isArray(product.wishlist) && product.wishlist.some((entry) => String(entry.user_id) === String(userId));
          initialProductStates[product.id] = isProductInWishlist;
        });

        setProductStates(initialProductStates);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [data, userId]);



  // Check if data is null or undefined or not an array
  if (!data || !Array.isArray(data) || data.length === 0) {
    return null; // or return some default content or loading indicator
  }

  // Function to format price with commas and decimals
  const formatPrice = (price) => {
    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP', // Change to your desired currency code
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);

    return formattedPrice.replace(/\.00$/, ''); // Remove '.00' if the fractional part is zero
  };

  // Function to limit the number of characters
  const limitCharacters = (text, maxLength) => {
    if (!text) {
      return ''; // or return some default value
    }
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const toggleLoginModal = () => {
    setLoginModalOpen((prevLoginModalOpen) => !prevLoginModalOpen)
  }

  return (
    <>
      {loginModalOpen && <LoginModal onClick={toggleLoginModal} />}
      {data.map((product, index) => {

        // Ensure product.createdAt is a valid date before using it
        const createdAtDate = new Date(product.createdAt);
        if (isNaN(createdAtDate.getTime())) {
          console.error('Invalid date value:', product.createdAt);
          return null; // or handle the invalid date value in some way
        }

        const handleWishlistClick = async (productId) => {
          try {
            const isAdded = productStates[productId] || false;

            if (!userId) { // If user is not authenticated
              // setShowSignInMessage(prevState => ({
              //   ...prevState,
              //   [productId]: !prevState[productId], // Toggle the sign-in message for this specific product
              // }));
              // return; // Exit the function without adding/removing from wishlist
              setLoginModalOpen(true)
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



            // Update wishlist count for all products after state changes
            const updatedWishlistCounts = {};
            data.forEach((prod) => {
              updatedWishlistCounts[prod.id] = getWishlistCount(prod.id);
            });

            // Set the updated wishlist counts
            setWishlistCount(updatedWishlistCounts);
            // Force re-render by updating state with a dummy value

          } catch (error) {
            console.error('Error updating wishlist:', error);
          }
        };

        return (
          <div key={index} className="thumbnail-container">
            <Link to={`/productdetails/${product.id}/${encodeURIComponent(product.product_name)}`} >
              <div className='image-holder'>
                {product.images && product.images[0] && (
                  <img src={product.images[0].image_url || NoImage} alt={`Product ${index}`} className='product-img' />
                )}
                {!product.images && (
                  <img src={NoImage} alt={`No Images Available`} className='product-img' />
                )}
              </div>
            </Link>
            <div className='product-info'>
              <Link to={`/productdetails/${product.id}/${encodeURIComponent(product.product_name)}`} className='product-name'><p>{limitCharacters(product.product_name, 55)}</p></Link>
              {product.seller && (
                <small>{product.seller.city || ''}, {limitCharacters(product.seller.region, 15) || ''}</small>
              )}
              <div className="date-post">
                <div className="small-clock"><ClockIcon /></div>
                <small>{formatDistanceToNow(new Date(product.createdAt), { addSuffix: true, locale: enUS })}</small>
              </div>
            </div>
            <div className='prod-condition-price'>
              <div className='col-price'>
                <small>{product.product_condition}</small>
                <div className="price">{formatPrice(product.price)}</div>
              </div>
              <div className='col-wishlist'>
                {/* {showSignInMessage[product.id] && !userId && (
                  <div ref={signInRef} className='add-wishlist-sign-in'>
                    <h6>You like this item?</h6>
                    <p>Sign in to add this item to your wishlist</p>
                    <Link to={'/loginemail'}>Sign in</Link>
                  </div>
                )} */}
                <div className='wishlist-counter'>{wishlistCount[product.id] || ''}</div>
                <button onClick={() => handleWishlistClick(product.id)} className='heart-icon'>
                  {productStates[product.id] && userId ? <HeartSolid /> : <HeartRegular />}
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}

export default ProductCard
