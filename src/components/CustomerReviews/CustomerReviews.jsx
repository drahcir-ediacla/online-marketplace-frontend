import React from 'react'
import './style.scss'
import { ReactComponent as ThreeDots } from '../../assets/images/three-dots.svg'

const CustomerReviews = ({posts, loading}) => {

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <>
    {posts.map(data => (
      <div key={data.id} className="customer-review">
        <div className='col-left-customer-review'><img src={data.image} alt="" className='customer-pic' /></div>
        <div className='col-right-customer-review'>
          <div>
            <div className='stars-dots-container'>
              <div className="star-rating-customer">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-regular fa-star"></i>
              </div>
              <div className='three-dots'><ThreeDots /></div>
            </div>
            <div><span className='name-customer-review'>{data.name}</span> - <span className='date-customer-review'>{data.date}</span></div>
          </div>
          <div><p>{data.review}</p></div>
        </div>
      </div>
      ))}
    </>
  )
}

export default CustomerReviews
