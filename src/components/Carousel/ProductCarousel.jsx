import React from 'react'
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Link } from 'react-router-dom'
import { ReactComponent as ClockIcon } from '../../assets/images/clock-regular.svg'
import { ReactComponent as HeartIcon } from '../../assets/images/heart-regular.svg';
import './style.scss'
import NoImage from '../../assets/images/no-image-available.png'

const ProductCarousel = ({ data }) => {

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

  // Customize Button Arrow
  //   const CustomButtonGroup = ({ next, previous }) => (
  //     <div className="custom-button-group">
  //       <button onClick={previous}>Previous</button>
  //       <button onClick={next}>Next</button>
  //     </div>
  //   );

  return (
    <>
      <Carousel responsive={responsive} draggable={true}>
        {data.map((product, index) => {
          // Logging to check the value of product.created_at
          console.log('Product created_at:', product.createdAt);

          // Ensure product.created_at is a valid date before using it
          const createdAtDate = new Date(product.createdAt);
          if (isNaN(createdAtDate.getTime())) {
            console.error('Invalid date value:', product.createdAt);
            return null; // or handle the invalid date value in some way
          }

          return (
            <div key={index} className="thumbnail-container">
              <div>
                <Link to={`/productdetails/${product.id}/${product.product_name}`} className='image-holder'>
                  {product.images && product.images[0] && (
                    <img src={product.images[0].image_url || NoImage} alt={`Product ${index}`} className='product-img' />
                  )}
                  {!product.images && (
                    <img src={NoImage} alt={`No Images Available`} className='product-img' />
                  )}
                </Link>
                <div className='product-info'>
                  <Link to={`/productdetails/${product.id}/${product.product_name}`} className='product-name'>
                    <p>{limitCharacters(product.product_name, 65)}</p>
                  </Link>
                  <small>{(product.seller && product.seller.city) || ''}, {(product.seller && product.seller.region) || ''}</small>
                  <div className="date-post">
                    <div className="small-clock"><ClockIcon /></div>
                    <small>{formatDistanceToNow(createdAtDate, { addSuffix: true, locale: enUS })}</small>
                  </div>
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
    </>
  );
}

export default ProductCarousel
