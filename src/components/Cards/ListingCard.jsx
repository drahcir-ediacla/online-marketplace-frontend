import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import './style.scss';
import { ReactComponent as ClockIcon } from '../../assets/images/clock-regular.svg';
import BtnGreen from '../Button/BtnGreen';
import { ReactComponent as HeartRegular } from '../../assets/images/heart-regular.svg';
import { ReactComponent as HeartSolid } from '../../assets/images/heart-solid.svg';
import { ReactComponent as ThreeDots } from '../../assets/images//three-dots.svg';
import { ReactComponent as EditIcon } from '../../assets/images/edit-icon.svg';
import { ReactComponent as DeleteIcon } from '../../assets/images/delete-icon.svg';
import { ReactComponent as CheckIcon } from '../../assets/images/check-o.svg';
import NoImage from '../../assets/images/no-image-available.png'

const ListingCard = ({ data, city, region, authenticatedUser, userId, addToWishlist, removeFromWishlist, wishlistCount, setWishlistCount, getWishlistCount }) => {

  const [productStates, setProductStates] = useState({});
  const [isOptionOpen, setIsOptionOpen] = useState({});




  // Initialize productStates based on initial wishlist data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ... (fetching data logic)

        // Set productStates after fetching data
        const initialProductStates = {};
        data.forEach((product) => {
          const isProductInWishlist = Array.isArray(product.wishlist) && product.wishlist.some((entry) => String(entry.user_id) === String(authenticatedUser?.id));
          initialProductStates[product.id] = isProductInWishlist;
        });

        setProductStates(initialProductStates);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [data, authenticatedUser?.id]);


  // Check if data is null or undefined
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
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };




  const toggleOption = (productId) => {
    setIsOptionOpen((prevIsOptionOpen) => ({
      ...prevIsOptionOpen,
      [productId]: !prevIsOptionOpen[productId],
    }));
  };

  

  return (
    <>
      {data.map((product, index) => {
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
          <div key={index} className="prod-listing-thumb">
            <div style={{ height: "333px" }}>
              <Link to={`/productdetails/${product.id}/${encodeURIComponent(product.product_name)}`} className='image-holder'>
                {product.images && product.images[0] && (
                  <img src={product.images[0].image_url || NoImage} alt={`Product ${index}`} className='product-img' />
                )}
                {!product.images && (
                  <img src={NoImage} alt={`No Images Available`} className='product-img' />
                )}
              </Link>
              <div className='product-info'>
                <Link to={`/productdetails/${product.id}/${encodeURIComponent(product.product_name)}`} className='product-name'><p>{limitCharacters(product.product_name, 65)}</p></Link>
                <small>{city}, {region}</small>
                <div className="date-post"><div className="small-clock"><ClockIcon /></div><small>{formatDistanceToNow(new Date(product.createdAt), { addSuffix: true, locale: enUS })}</small></div>
              </div>
            </div>
            <div>
              <div className='prod-condition-price'>
                <div className='col-price'>
                  <small>{product.product_condition}</small>
                  <div className="price">{formatPrice(product.price)}</div>
                </div>
                <div className='col-wishlist'>
                  <div className='three-dots'>
                    <ThreeDots onClick={() => toggleOption(product.id)} />
                  </div>
                  {isOptionOpen[product.id] && (
                    <div className='option-manage-listed-items'>
                      <ul>
                        <li><div className='edit-icon'><EditIcon /></div><span>Edit Listing</span></li>
                        <li><div className='edit-icon'><CheckIcon /></div><span>Mark as Sold</span></li>
                        <li><div className='delete-icon'><DeleteIcon /></div><span>Delete Listing</span></li>
                      </ul>
                    </div>
                  )}
                  <div className='wishlist-counter'>{wishlistCount[product.id] || ''}</div>
                  <button onClick={() => handleWishlistClick(product.id)} className='heart-icon'>
                    {productStates[product.id] ? <HeartSolid /> : <HeartRegular />}
                  </button>
                </div>
              </div>
              {(authenticatedUser?.id === userId) && (
                <>
                  <div className='promote-btn-box'><BtnGreen label='Promote' className='promote-btn' /></div>
                </>
              )}
            </div>
          </div>
        )
      })}
    </>
  );
};

export default ListingCard;