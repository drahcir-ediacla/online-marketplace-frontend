import React, {useEffect, useState} from 'react'
import axios from '../../apicalls/axios';
import './style.scss'
import { FaStar } from 'react-icons/fa';
import { ReactComponent as ThreeDots } from '../../assets/images/three-dots.svg'

const CustomerReviews = ({posts, targetId}) => {

  const [reviewsData, setReviewsData] = useState([])
 
  useEffect (() => {
    const fetchReviewsByTargetId = async() => {
      try {
        const response = await axios.get(`/api/get-reviews/${targetId}`)
      } catch(error) {

      }
    }
  })

  const stars = Array(5).fill(0);


  return (
    <>
    {posts.map(data => (
      <div key={data.id} className="customer-review">
        <div className='col-left-customer-review'><img src={data.image} alt="" className='customer-pic' /></div>
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
