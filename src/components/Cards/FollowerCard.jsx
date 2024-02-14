import React from 'react'
import './style.scss'
import DefaultProfilePic from '../../assets/images/profile-avatar.png'
import BtnClear from '../Button/BtnClear'

const FollowerCard = () => {
    return (
        <>
            <div className="follower-card-container">
                <div className="follower-card-row1">
                    <img src={DefaultProfilePic} alt="" />
                </div>
                <span className='follower-name'>Mark Ezperanza</span>
                <span className='number-follower'>29 Followers</span>
                <BtnClear label='Follow' className='following-button' />
            </div>

        </>
    )
}

export default FollowerCard
