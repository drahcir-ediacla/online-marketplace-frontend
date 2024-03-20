import React from 'react'
import './style.scss'
import DefaultProfilePic from '../../assets/images/profile-avatar.png'
import { FaStar } from 'react-icons/fa';
import { ReactComponent as ThreeDots } from '../../assets/images/three-dots.svg'

const CustomerReviews = ({ posts }) => {

  const stars = Array(5).fill(0);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <>
      {posts.map(data => (
        <div key={data.review_id} className="customer-review">
          <div className='col-left-customer-review'><img src={data.profile_pic || DefaultProfilePic} alt="" className='customer-pic' /></div>
          <div className='col-right-customer-review'>
            <div>
              <div className='stars-dots-container'>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {stars.map((_, index) => {
                    return (
                      <FaStar
                        key={index}
                        size={15}
                        style={{ cursor: 'pointer' }}
                        color={(data.rating) > index ? '#FFD800' : '#bcbcbc'}
                      />
                    )
                  })}
                </div>
                <div className='three-dots'><ThreeDots /></div>
              </div>
              <div><span className='name-customer-review'>{data.reviewer_name}</span> - <span className='date-customer-review'>{formatDate(data?.createdAt)}</span></div>
            </div>
            <div><p>{data.comment}</p></div>
          </div>
        </div>
      ))}
    </>
  )
}

export default CustomerReviews
