import React, { useEffect, useState} from 'react'
import axios from '../../apicalls/axios'
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import Carousel from 'react-multi-carousel';
import { useDispatch } from 'react-redux'
import { Setloader } from '../../redux/reducer/loadersSlice'
import { Link } from 'react-router-dom'
import './style.scss'
import 'react-multi-carousel/lib/styles.css';
import BtnCategory from  '../../components/Button/BtnCategory'
import BtnSeeMore from  '../../components/Button/BtnSeeMore'
import { ReactComponent as ClockIcon } from '../../assets/images/clock-regular.svg'
import { ReactComponent as HeartIcon } from '../../assets/images/heart-regular.svg';
import NoImage from '../../assets/images/no-image-available.png'

const NewItems = () => {

  const [products, setProducts] = useState([]);
  const [err, setErr] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      dispatch(Setloader(true));

      try {
        // Fetch the category's data
        const response = await axios.get('/api/getallproducts');

        setProducts(response.data);
        dispatch(Setloader(false));

      } catch (error) {
        dispatch(Setloader(false));
        console.error('Error fetching category data:', error);

        // Check if the error is due to unauthorized access
        if (error.response && error.response.status === 500) {
          return error.message
          // Handle unauthorized access, e.g., redirect to login
        } else {
          // Handle other errors
          setErr(true); // Depending on your requirements
        }
      }
    }
    fetchData();
  }, [dispatch])


  // Check if data is null or undefined
  if (!products) {
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
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
      slidesToSlide: 5
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 4
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };


  return (
    <>
      <div className="product-section-container">
        <div className='product-section-title'>
            <h3>Newly Listed Items</h3>
        </div>
        <div className='product-section-btns'>
          <div className='sub-categories-btn'>
            <BtnCategory label="Shoes" className='active' />
            <BtnCategory label="Mobile" />
            <BtnCategory label="iPhone Accessories" />
            <BtnCategory label="Switch Games" />
            <BtnCategory label="Bicycles" />
            <BtnCategory label="Chanel" />
          </div>
          <BtnSeeMore label="See More Shoes >>" />
        </div>
        <div>
        <Carousel responsive={responsive} draggable={true}>
        {products.map((product, index) => {
          // Logging to check the value of product.created_at
          console.log('Product created_at:', product.created_at);

          // Ensure product.created_at is a valid date before using it
          const createdAtDate = new Date(product.created_at);
          if (isNaN(createdAtDate.getTime())) {
            console.error('Invalid date value:', product.created_at);
            return null; // or handle the invalid date value in some way
          }

          return (
            <div key={index} className="thumbnail-container">
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
                <small>{product.city || ''}, {(product.region) || ''}</small>
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
                  {product.wishlist}
                  <div className='heart-icon'><HeartIcon /></div>
                </div>
              </div>
            </div>
          );
        })}
      </Carousel>
        </div>
      </div>
    </>
  )
}

export default NewItems
