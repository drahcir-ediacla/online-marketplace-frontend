import React from 'react'
import {Link} from 'react-router-dom'
import './style.scss'
import { ReactComponent as ClockIcon } from '../../assets/images/clock-regular.svg'
import {ReactComponent as HeartIcon} from '../../assets/images/heart-regular.svg'
import BtnGreen from '../Button/BtnGreen'

const ListingCard = ({data}) => {
  return (
    <>
      {data.map((product, index) => (
        <Link to={product.path} key={index} className="prod-listing-thumb">
            <div className='image-holder'><img src={product.image} alt={`Product ${index}`} className='product-img' /></div>
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
            <div className='promote-btn-box'><BtnGreen label='Promote' className='promote-btn' /></div>
        </Link>
        ))}
    </>
  )
}

export default ListingCard
