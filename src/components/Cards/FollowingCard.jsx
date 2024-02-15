import React, { useEffect, useState } from 'react'
import axios from '../../apicalls/axios'
import { Link } from 'react-router-dom'
import './style.scss'
import DefaultProfilePic from '../../assets/images/profile-avatar.png'
import BtnClear from '../Button/BtnClear'

const FollowerCard = ({ data }) => {

    const [allFollowing, setAllFollowing] = useState([]);
    const [followerIds, setFollowerIds] = useState([]);
    const [following, setFollowing] = useState(false);

    console.log('followerIds:', followerIds)


    useEffect(() => {
        const fetchAllUserFollowing = async () => {
            try {
                const response = await axios.get(`/api/getall/following-${data.id}`)
                setAllFollowing(response.data)

                // Extract follower IDs
                const ids = response.data.map((follower) => follower.followerInfo.id);
                setFollowerIds(ids);
            } catch (error) {
                console.error('Error fetching all user following:', error);
            }
        }
        fetchAllUserFollowing()
    }, [data?.id])



    useEffect(() => {
        const fetchFollowingUser = async () => {
            try {
                const response = await axios.get(`/api/get/following-${followerIds}`);

                // Assuming your API response structure is { message: 'Following User' }
                setFollowing(response.data.message === 'Following User');
            } catch (error) {
                setFollowing(false);
            }
        };

        fetchFollowingUser();
    }, [followerIds]);


    return (
        <>
            <h5>{data?.display_name} following {allFollowing.length} user(s)</h5>
            <div className='follower-card-box'>
                {allFollowing.map((following, index) => (
                    <Link to={`/profile/${following.following_id}`} >
                        <div key={index} className="follower-card-container">
                            <div className="follower-card-row1">
                                <img src={following.followingInfo.profile_pic || DefaultProfilePic} alt="" />
                            </div>
                            <span className='follower-name'>{following.followingInfo.display_name}</span>
                            <span className='number-follower'>{following.followingInfo.following.length} Followers</span>

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
