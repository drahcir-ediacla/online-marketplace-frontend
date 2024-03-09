import React, { useState, useEffect } from 'react'
import './style.scss'
import DefaultProfilePic from '../../assets/images/profile-avatar.png'
import { ReactComponent as FBIcon } from '../../assets/images/facebook-icon.svg'
import { ReactComponent as GoogleIcon } from '../../assets/images/google-icon.svg'
import BtnClear from '../../components/Button/BtnClear'
import BtnGreen from '../Button/BtnGreen';
import axios from '../../apicalls/axios'
import { useSearchParams } from 'react-router-dom'




const ProfileInfoCard = ({ data, authenticatedUser, allFollowersList, allFollowingList }) => {
    console.log('user data1:', data);

    const [following, setFollowing] = useState(false);
    const [allFollowing, setAllFollowing] = useState([]);
    const [allFollower, setAllFollower] = useState([]);
    const originalDate = data?.createdAt || '';
    const formattedDate = new Date(originalDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });


    useEffect(() => {
        const fetchFollowingUser = async () => {
            try {
                const response = await axios.get(`/api/get/following-${data.id}`);

                // Assuming your API response structure is { message: 'Following User' }
                setFollowing(response.data.message === 'Following User');
            } catch (error) {
                setFollowing(false);
            }
        };

        fetchFollowingUser();
    }, [data?.id]);



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
    }, [data?.id])




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
    }, [data?.id])


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
                <img src={data?.profile_pic || DefaultProfilePic} alt="" className="profile-pic" />
                <span className='profile-name'>{data?.display_name}</span>
                <div className="seller-rating">
                    <span>4.0</span>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-regular fa-star-half-stroke"></i>
                    <i class="fa-regular fa-star"></i>
                    <span> | </span><span>5 Review(s)</span>
                </div>
                <div className='joined-date-loc'><span>{data?.city}</span> · <span>{formattedDate}</span></div>
                {/* <div className="profile-social-media">
                    <span>Social Media:</span>
                    <div className='fb-icon'><FBIcon /></div>
                    <div className='google-icon'><GoogleIcon /></div>
                </div> */}
                <div className="profile-desc"><p>{data?.bio}</p></div>
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
        </>
    )
}

export default ProfileInfoCard
