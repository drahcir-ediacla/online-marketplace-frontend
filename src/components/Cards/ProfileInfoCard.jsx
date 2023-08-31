import React from 'react'
import './style.scss'
import ProfilePic from '../../assets/images/profile-pic_1.png'
import { ReactComponent as FBIcon } from '../../assets/images/facebook-icon.svg'
import { ReactComponent as GoogleIcon } from '../../assets/images/google-icon.svg'

const ProfileInfoCard = () => {
  return (
    <>
        <div className='profile-info-box'>
            <img src={ProfilePic} alt="" className="profile-pic" />
            <span className='profile-name'>Vito Corleon</span>
            <div className="seller-rating">
                <span>4.0</span>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-regular fa-star-half-stroke"></i>
                    <i class="fa-regular fa-star"></i>
                <span> | </span><span>5 Review(s)</span>
            </div>
            <div className='joined-date-loc'><span>Pasig</span> · <span>Joined in July 2020</span></div>
            <div className="profile-social-media">
                <span>Social Media:</span>
                <div className='fb-icon'><FBIcon /></div>
                <div className='google-icon'><GoogleIcon /></div>
            </div>
            <div className="profile-desc"><p>We doing Direct drop shipping from Distributor of the brands we have MOP only: Gcash No.: 0965567314 Shipping/payment Schedule: Mon-Fri (8am-3pm) Free Delivery is by LEX</p></div>
            <div className='follow'>
                <div className='follow-counter'><p>Followers</p><span>25</span></div>
                <div className='follow-counter'><p>Following</p><span>16</span></div>
            </div>
        </div>
    </>
  )
}

export default ProfileInfoCard
