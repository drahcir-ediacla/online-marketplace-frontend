import React, { useEffect, useState } from 'react';
import axios from '../../apicalls/axios';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { Setloader } from '../../redux/reducer/loadersSlice';
import './style.scss';
import { ReactComponent as ClockIcon } from '../../assets/images/clock-regular.svg';
import { ReactComponent as HeartIcon } from '../../assets/images/heart-regular.svg';
import BtnGreen from '../Button/BtnGreen';
import NoImage from '../../assets/images/no-image-available.png'

const ListingCard = ({ data, city, region }) => {

  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(Setloader(true))
        // Fetch the user's profile data
        const response = await axios.get(`/api/user/${id}`);

        setUser(response.data);

        // Fetch the authenticated user's data
        const authResponse = await axios.get('/auth/check-auth');
        setAuthenticatedUser(authResponse.data.user)
        dispatch(Setloader(false))
      } catch (error) {
        dispatch(Setloader(false))

        if (error.response && error.response.status === 401) {
          console.error('User is not authenticated');
        } else {
          console.error('Request Error:', error.message);
        }
      }
    }
    fetchData()
  }, [id, dispatch])

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
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };


  return (
    <>
      {data.map((product, index) => (
        <div key={index} className="prod-listing-thumb">
          <div style={{height: "333px"}}>
            <Link to={`/productdetails/${product.id}/${product.product_name}`} className='image-holder'>
              {product.images && product.images[0] && (
                <img src={product.images[0].image_url || NoImage} alt={`Product ${index}`} className='product-img' />
              )}
              {!product.images && (
                <img src={NoImage} alt={`No Images Available`} className='product-img' />
              )}
            </Link>
            <div className='product-info'>
              <Link to={`/productdetails/${product.id}/${product.product_name}`} className='product-name'><p>{limitCharacters(product.product_name, 65)}</p></Link>
              <small>{city}, {region}</small>
              <div className="date-post"><div className="small-clock"><ClockIcon /></div><small>{formatDistanceToNow(new Date(product.created_at), { addSuffix: true, locale: enUS })}</small></div>
            </div>
          </div>
          <div>
            <div className='prod-condition-price'>
              <div className='col-price'>
                <small>{product.product_condition}</small>
                <div className="price">{formatPrice(product.price)}</div>
              </div>
              <div className='col-wishlist'>
                <div className='heart-icon'><HeartIcon /></div>
              </div>
            </div>
            {(authenticatedUser?.id === user?.id) && (
              <>
                <div className='promote-btn-box'><BtnGreen label='Promote' className='promote-btn' /></div>
              </>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default ListingCard;