import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './style.scss'
import Logo from '../../../assets/images/yogeek-forum-logo.png'
import DefaultAvatar from '../../../assets/images/avatar-icon.png'
import { ReactComponent as TriangleIcon } from '../../../assets/images/triangle-up.svg';


const ForumHeader = ({ authUser, signIn }) => {

    const [dropDownProfile, setDropDownProfile] = useState(false);
    const profileDropDown = useRef(null);

    useEffect(() => {
        const handleGlobalClick = (event) => {
            if (profileDropDown.current && !profileDropDown.current.contains(event.target)) {
                setDropDownProfile(false);
            }
        };

        document.addEventListener('click', handleGlobalClick);

        return () => {
            document.removeEventListener('click', handleGlobalClick);
        };
    }, []);


    const toggleDropDownProfile = () => {
        setDropDownProfile((prevdropDownProfile) => !prevdropDownProfile)
    }

    const logout = () => {
        const localBaseUrl = process.env.REACT_APP_BASE_URL;
        const logoutPath = '/api/logout';

        const logoutUrl = `${localBaseUrl}${logoutPath}`;

        window.open(logoutUrl, '_self');
    };

    return (
        <>
            <div className='forum-header-container'>
                <Link to='/forum'><img src={Logo} alt="" className='forum-logo' /></Link>
                <div className='forum-header-right-col'>
                    <Link to='/'>Marketplace</Link> | 
                    {authUser ? (
                        <>
                            {authUser?.display_name}
                            <img src={authUser?.profile_pic} alt="" className='default-forum-profile-avatar' onClick={toggleDropDownProfile} ref={profileDropDown} />
                        </>
                    ) : (
                        <>
                            <button onClick={signIn} className='onclick-show-login-modal'>Sign In</button>
                            <button onClick={signIn} className='onclick-show-login-modal'><img src={DefaultAvatar} alt="" className='default-forum-profile-avatar' /></button>
                        </>
                    )}
                </div>
                {dropDownProfile && (
                    <div className="my-account-dropdown-container">
                        <div className='my-account-dropdown'>
                            <div className='triangle-icon'><TriangleIcon /></div>
                            <ul>
                                <li><Link to={`/forum/profile/${authUser?.id}/created_discussions`}>My Forum Profile</Link></li>
                                <li><Link onClick={logout}>Logout</Link></li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}


export default ForumHeader