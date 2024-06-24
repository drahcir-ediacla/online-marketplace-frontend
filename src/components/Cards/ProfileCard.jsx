import React, { useState, useEffect } from 'react'
import './style.scss'
import { FaStar } from 'react-icons/fa';
import DefaultProfilePic from '../../assets/images/profile-avatar.png'
import { ReactComponent as FBIcon } from '../../assets/images/facebook-icon.svg'
import { ReactComponent as GoogleIcon } from '../../assets/images/google-icon.svg'
import BtnClear from '../../components/Button/BtnClear'
import BtnGreen from '../Button/BtnGreen';
import axios from '../../apicalls/axios'
import { useSearchParams } from 'react-router-dom'




const ProfileInfoCard = ({ data, avgRating, totalReviews, authenticatedUser, allFollowersList, allFollowingList }) => {

    const [following, setFollowing] = useState(false);
    const [profileId, setProfileId] = useState(false);
    const [allFollowing, setAllFollowing] = useState([]);
    const [allFollower, setAllFollower] = useState([]);
    const originalDate = data?.createdAt || '';
    const formattedDate = new Date(originalDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    const stars = Array(5).fill(0);



    useEffect(() => {
        const fetchFollowingUser = async () => {
            try {
                const response = await axios.get(`/api/get/following-${data.id}`);
                console.log('followingdata.id:', data?.id)

                // Assuming your API response structure is { message: 'Following User' }
                setFollowing(response.data.message === 'Following User');
            } catch (error) {
                setFollowing(false);
            }
        };

        fetchFollowingUser();
    }, [data?.id, following]);



    useEffect(() => {
        const fetchAllUserFollowing = async () => {
            try {
                const response = await axios.get(`/api/getall/following-${data.id}`)
                setAllFollowing(response.data)
            } catch (error) {
                console.error('Error fetching all user following:', error);
            }
        }
        fetchAllUserFollowing()
    }, [data?.id, following])




    useEffect(() => {
        const fetchAllUserFollower = async () => {
            try {
                const response = await axios.get(`/api/getall/follower-${data.id}`)
                setAllFollower(response.data)
            } catch (error) {
                console.error('Error fetching all user following:', error);
            }
        }
        fetchAllUserFollower()
    }, [data?.id, following])


    // Check if data is null or undefined
    if (!data) {
        return null; // or return some default content or loading indicator
    }



    const followUser = async () => {
        try {
            const response = await axios.post(`/api/follow-${data.id}`)
            setFollowing(true);
            return response
        } catch (error) {
            console.error('Error following user:', error);
        }
    }


    const unfollowUser = async () => {
        try {
            const response = await axios.post(`/api/unfollow-${data.id}`)
            setFollowing(false);
            return response
        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
    }




    return (
        <>
            <div className='profile-info-box'>
                <div className='profile-info-box-row1'>
                    <img src={data?.profile_pic || DefaultProfilePic} alt="" className="profile-pic" />
                    <div className='profile-name'>{data?.display_name}</div>
                </div>
                <div className='profile-info-box-row2'>
                    <div className="seller-rating">
                        <span>{avgRating === 0 ? ("") : (avgRating)}</span>
                        <div style={{ display: 'flex', gap: '3px' }}>
                            {stars.map((_, index) => {
                                return (
                                    <FaStar
                                        key={index}
                                        size={17}
                                        color={(avgRating || 0) > index ? '#FFD800' : '#bcbcbc'}
                                    />
                                )
                            })}
                        </div>
                        <span>|</span><span>{totalReviews || 0} Review(s)</span>
                    </div>
                    <div className='joined-date-loc'><span>{data?.city}</span> · <span>Joined in {formattedDate}</span></div>
                    {/* <div className="profile-social-media">
                    <span>Social Media:</span>
                    <div className='fb-icon'><FBIcon /></div>
                    <div className='google-icon'><GoogleIcon /></div>
                        </div> */}
                    <div className="profile-desc"><p>{data?.bio}</p></div>
                    <div className='follow-component-container'>
                        {(authenticatedUser && authenticatedUser?.id !== data?.id) && (
                            <>
                                <div className="follow-message-buttons">
                                    {!following ? (
                                        <BtnClear label='Follow' onClick={followUser} />
                                    ) : (
                                        <BtnClear label='Unfollow' className='unfollowing-btn' onClick={unfollowUser} />
                                    )}

                                </div>
                            </>
                        )}
                        <div className='follow'>
                            <div className='follow-counter' onClick={allFollowersList}><p>Followers</p><span>{allFollower.length}</span></div>
                            <div className='counter-divider'></div>
                            <div className='follow-counter' onClick={allFollowingList}><p>Following</p><span>{allFollowing.length}</span></div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default ProfileInfoCard
