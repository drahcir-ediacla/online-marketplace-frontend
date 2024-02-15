import React, { useEffect, useState } from 'react'
import axios from '../../apicalls/axios'
import { Link } from 'react-router-dom'
import useAuthentication from '../../hooks/authHook'
import './style.scss'
import DefaultProfilePic from '../../assets/images/profile-avatar.png'
import BtnClear from '../Button/BtnClear'

const FollowerCard = ({ data }) => {

    const { user } = useAuthentication();
    const [allFollower, setAllFollower] = useState([]);
    // const [followerIds, setFollowerIds] = useState([]);
    // const [following, setFollowing] = useState(false);

    

    useEffect(() => {
        const fetchAllUserFollower = async () => {
            try {
                const response = await axios.get(`/api/getall/follower-${data.id}`)
                setAllFollower(response.data)

                // Extract follower IDs
                // const ids = response.data.map((follower) => follower.followerInfo.id);
                // setFollowerIds(ids);
            } catch (error) {
                console.error('Error fetching all user following:', error);
            }
        }
        fetchAllUserFollower()
    }, [data?.id])


    // useEffect(() => {
    //     const fetchFollowingUser = async () => {
    //         try {
    //             const response = await axios.get(`/api/get/following-${followerIds}`);

    //             // Assuming your API response structure is { message: 'Following User' }
    //             setFollowing(response.data.message === 'Following User');
    //         } catch (error) {
    //             setFollowing(false);
    //         }
    //     };

    //     fetchFollowingUser();
    // }, [followerIds]);


    return (
        <>
            <h5>{data?.id !== user?.id ? (data?.display_name) : ('You')} have {allFollower?.length} follower(s)</h5>
            <div className='follower-card-box'>
                {allFollower.map((follower, index) => (
                    <Link to={`/profile/${follower?.follower_id}`} >
                        <div key={index} className="follower-card-container">
                            <div className="follower-card-row1">
                                <img src={follower?.followerInfo?.profile_pic || DefaultProfilePic} alt="" />
                            </div>
                            <span className='follower-name'>{follower?.followerInfo?.display_name}</span>
                            <span className='number-follower'>{follower?.followerInfo?.followers?.length} Followers</span>

                            {/* {!following ? (
                        <BtnClear label='Follow' className='following-button' />
                    ) : (
                        <BtnClear label='Following' className='unfollowing-btn' />
                    )} */}
                        </div>
                    </Link>
                ))}
            </div>
        </>
    )
}

export default FollowerCard
