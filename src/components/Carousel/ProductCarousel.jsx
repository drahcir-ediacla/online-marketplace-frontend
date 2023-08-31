import React from 'react'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import {Link} from 'react-router-dom'
import { ReactComponent as ClockIcon } from '../../assets/images/clock-regular.svg'
import {ReactComponent as HeartIcon} from '../../assets/images/heart-regular.svg';
import './style.scss'

const ProductCarousel = ({product}) => {
    
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
    <Carousel responsive={responsive} draggable={true} >
        {product.map((product, index) => (
        <Link to={product.path} key={index} className="thumbnail-container">
            <div className='image-holder'><img src={product.image} alt={`Product ${index}`} /></div>
            <div className='product-info'>
                <p>{product.name}</p>
                <small>{product.location}</small>
                <div className="date-post"><div className="small-clock"><ClockIcon /></div><small>{product.time}</small></div>
            </div>
            <div className='prod-condition-price'>
                <div className='col-price'>
                    <small>{product.condition}</small>
                    <div className="price">{product.price}</div>
                </div>
                <div className='col-wishlist'>
                    {product.wishlist}
                    <div className='heart-icon'><HeartIcon /></div>
                </div>
            </div>
        </Link>
      ))}
    </Carousel>
    </>
  )
}

export default ProductCarousel
