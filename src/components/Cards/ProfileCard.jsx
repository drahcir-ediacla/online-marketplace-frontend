import React, { useEffect, useState } from 'react'
import axios from '../../apicalls/axios';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Setloader } from '../../redux/reducer/loadersSlice';
import './style.scss'
import DefaultProfilePic from '../../assets/images/profile-avatar.png'
import { ReactComponent as FBIcon } from '../../assets/images/facebook-icon.svg'
import { ReactComponent as GoogleIcon } from '../../assets/images/google-icon.svg'
import BtnClear from '../../components/Button/BtnClear'
import BtnGreen from '../Button/BtnGreen';




const ProfileInfoCard = () => {

    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [authenticatedUserId, setAuthenticatedUserId] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            dispatch(Setloader(true));

            try {
                // Fetch the user's profile data
                const response = await axios.get(`/api/user/${id}`);
                setUser(response.data);
                
                // Fetch the authenticated user's data
                const authResponse = await axios.get('/auth/check-auth');
                setAuthenticatedUserId(authResponse.data.user);

                dispatch(Setloader(false));
            } catch (error) {
                dispatch(Setloader(false));
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id, dispatch]);

    // Check if user exists before accessing its properties
    const profilePic = user?.profile_pic || DefaultProfilePic;
    const displayName = user?.display_name || "Anonymous";
    const bio = user?.bio || '';
    const city = user?.city || '';
    const originalDate = user?.createdAt || '';
    const formattedDate = new Date(originalDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

    return (
        <>
            <div className='profile-info-box'>
                <img src={profilePic} alt="" className="profile-pic" />
                <span className='profile-name'>{displayName}</span>
                <div className="seller-rating">
                    <span>4.0</span>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-regular fa-star-half-stroke"></i>
                    <i class="fa-regular fa-star"></i>
                    <span> | </span><span>5 Review(s)</span>
                </div>
                <div className='joined-date-loc'><span>{city}</span> · <span>{formattedDate}</span></div>
                <div className="profile-social-media">
                    <span>Social Media:</span>
                    <div className='fb-icon'><FBIcon /></div>
                    <div className='google-icon'><GoogleIcon /></div>
                </div>
                <div className="profile-desc"><p>{bio}</p></div>
                {(authenticatedUserId?.id !== user?.id) && (
                    <>
                        <div className="follow-message-buttons">
                            <BtnClear label='Follow' /> <BtnGreen label='Message' />
                        </div>
                    </>
                )}
                <div className='follow'>
                    <div className='follow-counter'><p>Followers</p><span>25</span></div>
                    <div className='follow-counter'><p>Following</p><span>16</span></div>
                </div>
            </div>
        </>
    )
}

export default ProfileInfoCard
