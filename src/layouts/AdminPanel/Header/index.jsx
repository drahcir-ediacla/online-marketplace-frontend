import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import './style.scss'
import Avatar from '../../../assets/images/avatar-icon.png'
import { ReactComponent as BellIcon } from '../../../assets/images/bell-icon.svg'
import { ReactComponent as GearOIcon } from '../../../assets/images/gear-o-icon.svg'
import { ReactComponent as TriangleIcon } from '../../../assets/images/triangle-up.svg'
import { ReactComponent as LogoutIcon } from '../../../assets/images/logout-icon.svg'

const Header = () => {

    const profileDropDown = useRef(null);
    const authUser = useSelector((state) => state.user.data);
    console.log('authUser:', authUser )
    const [dropDownProfile, setDropDownProfile] = useState(false)

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
        setDropDownProfile((prev) => !prev)
    }

    const logout = async () => {
        const logoutUrl = `${process.env.REACT_APP_BASE_URL}/api/logout`;

        try {
            const response = await fetch(logoutUrl, {
                method: 'GET',
                credentials: 'include', // Include cookies for the logout API
            });

            if (response.ok) {
                // Redirect after successful logout
                window.location.href = '/admin/login';
            } else {
                console.error('Logout failed:', response.status, response.statusText);
                // Optionally show an error message to the user
            }
        } catch (error) {
            console.error('An error occurred during logout:', error);
            // Optionally show an error message to the user
        }
    };


    return (
        <>
            <div className="header-container">
                <div className="header-nav">
                    <div className='avatar-icon' onClick={toggleDropDownProfile}>
                        <img src={authUser?.profile_pic || Avatar} alt="" ref={profileDropDown} />
                        {dropDownProfile && (
                            <>
                                <div className="my-profile-dropdown">
                                    <div className="triangle-icon"><TriangleIcon /></div>
                                    <ul>
                                        <li>
                                            <div className='drop-down-avatar'><img src={authUser.profile_pic || Avatar} alt="" /></div>
                                            <div className='admin-name-role'>
                                                <div className='admin-name'>{authUser.display_name ? authUser.display_name : 'Anonymous'}</div>
                                                <div className='admin-role'>Administrator</div>
                                            </div>
                                        </li>
                                        <li>
                                            <button>
                                                <p>My Profile</p>
                                            </button>
                                        </li>
                                        <li>
                                            <button onClick={logout}>
                                                <p>Logout</p>
                                                <div className="logout-icon"><LogoutIcon /></div>
                                            </button>
                                        </li>
                                    </ul>

                                </div>
                            </>
                        )}
                    </div>
                    <div className='vertical-line'></div>
                    <div className='bell-icon'><BellIcon /></div>
                    <div className='vertical-line'></div>
                    <div className='gear-o-icon'><GearOIcon /></div>

                </div>
            </div>
        </>
    )
}

export default Header
