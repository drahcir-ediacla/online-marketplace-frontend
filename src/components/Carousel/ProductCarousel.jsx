import React, { useState, useEffect, useCallback } from 'react'
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Link } from 'react-router-dom'
import './style.scss'
import { ReactComponent as ClockIcon } from '../../assets/images/clock-regular.svg'
import { ReactComponent as HeartRegular } from '../../assets/images/heart-regular.svg';
import { ReactComponent as HeartSolid } from '../../assets/images/heart-solid.svg';
import NoImage from '../../assets/images/no-image-available.png'

const ProductCarousel = ({ data, addToWishlist, removeFromWishlist, userId }) => {


  const [productStates, setProductStates] = useState({});
  const [wishlistCount, setWishlistCount] = useState({});



  // Use useCallback to memoize the function
  const getWishlistCount = useCallback((productId) => {
    const productData = data.find((product) => product.id === productId);
    return productData ? (productData.wishlist ? productData.wishlist.length : 0) : 0;
  }, [data]);


  // Use useEffect to update wishlist count after state changes
  useEffect(() => {
    // Update wishlist count for all products
    const updatedWishlistCounts = {};
    data.forEach((product) => {
      updatedWishlistCounts[product.id] = getWishlistCount(product.id);
    });

    // Set the updated wishlist counts
    setWishlistCount(updatedWishlistCounts);

    console.log('Wishlist count updated:', updatedWishlistCounts);
  }, [productStates, data, getWishlistCount]);


  // Initialize productStates based on initial wishlist data
  useEffect(() => {
    const initialProductStates = {};
    data.forEach((product) => {
      const isProductInWishlist = Array.isArray(product.wishlist) && product.wishlist.some((entry) => String(entry.user_id) === String(userId));
      initialProductStates[product.id] = isProductInWishlist;
    });
    setProductStates(initialProductStates);
  }, [data, userId]);




  // Check if data is null or undefined
  if (!data) {
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

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1440 },
      items: 5,
      slidesToSlide: 5
    },
    tablet: {
      breakpoint: { max: 1440, min: 1024 },
      items: 4
    },
    tablet: {
      breakpoint: { max: 1024, min: 740 },
      items: 3
    },
    mobile: {
      breakpoint: { max: 740, min: 0 },
      items: 2
    }
  };





  return (
    <>
      <Carousel responsive={responsive} draggable={true} removeArrowOnDeviceType={['mobile', 'tablet']} autoPlay containerClass="carousel-container">
        {data.map((product, index) => {
          const createdAtDate = new Date(product.createdAt);

          if (isNaN(createdAtDate.getTime())) {
            console.error('Invalid date value:', product.createdAt);
            return null; // or handle the invalid date value in some way
          }

          // Check if the authenticated user's user_id is in the wishlist for the current product
          const isProductInWishlist = Array.isArray(product.wishlist) && product.wishlist.some((entry) => String(entry.user_id) === String(userId));
          console.log('userId:', userId);
          console.log('isProductInWishlist:', isProductInWishlist);
          console.log('product.wishlist:', product.wishlist);

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
                [productId]: !isAdded,
              }));

              // Update wishlist count for all products after state changes
              const updatedWishlistCounts = {};
              data.forEach((prod) => {
                updatedWishlistCounts[prod.id] = getWishlistCount(prod.id);
              });

              // Set the updated wishlist counts
              setWishlistCount(updatedWishlistCounts);
            } catch (error) {
              console.error('Error updating wishlist:', error);
            }
          };

          return (
            <div className="thumbnail-container">
                <Link to={`/productdetails/${product.id}/${encodeURIComponent(product.product_name)}`}>
                  <div className='image-holder'>
                    {product.images && product.images[0] && (
                      <img src={product.images[0].image_url || NoImage} alt={`Product`} className='product-img' />
                    )}
                    {!product.images && (
                      <img src={NoImage} alt={`No Images Available`} className='product-img' />
                    )}
                  </div>
                </Link>
                <div className='product-info'>
                  <Link to={`/productdetails/${product.id}/${encodeURIComponent(product.product_name)}`} className='product-name'><p>{limitCharacters(product.product_name, 55)}</p></Link>
                  {product.seller && (
                    <small>{product.seller.city || ''}, {(product.seller.region) || ''}</small>
                  )}
                  <div className="date-post">
                    <div className="small-clock"><ClockIcon /></div>
                    <small>{formatDistanceToNow(createdAtDate, { addSuffix: true, locale: enUS })}</small>
                  </div>
                </div>
              <div className='prod-condition-price'>
                <div className='col-price'>
                  <small>{product.product_condition}</small>
                  <div className="price">{formatPrice(product.price)}</div>
                </div>
                <div className='col-wishlist'>
                  <div className='wishlist-counter'>{wishlistCount[product.id] || ''}</div>
                  <button onClick={() => handleWishlistClick(product.id)} className='heart-icon'>
                    {productStates[product.id] ? <HeartSolid /> : <HeartRegular />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </Carousel>
    </>
  );
}

export default ProductCarousel
