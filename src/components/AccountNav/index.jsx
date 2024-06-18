import React, { useState, useEffect } from 'react'
import axios from '../../apicalls/axios'
import { Link } from 'react-router-dom'
import './style.scss'
import useAuthentication from '../../hooks/authHook'
import Logo from '../../assets/images/Yogeek-logo-gray.png'
import { ReactComponent as UserIcon } from '../../assets/images/user-icon.svg'

const AccountNav = () => {

    const { user } = useAuthentication();
    const [accountNavOpen, setAccountNavOpen] = useState(false)
    const [unreadNotifications, setUnreadNotifications] = useState([])

    const toggleAccountNav = () => {
        setAccountNavOpen((prevAccountNavOpen) => !prevAccountNavOpen)
    }

    const logout = () => {
        const localBaseUrl = process.env.REACT_APP_BASE_URL;
        const logoutPath = '/api/logout';

        const logoutUrl = `${localBaseUrl}${logoutPath}`;

        window.open(logoutUrl, '_self');
    };


    useEffect(() => {
        const fetchUnreadNotifications = async () => {
            try {
                const response = await axios.get('/api/notifications/unread');

                setUnreadNotifications(response.data);

            } catch (error) {
                console.error('Error fetching unread notifications:', error);
            }
        }
        fetchUnreadNotifications()
    }, [])


    return (
        <>
            <UserIcon onClick={user ? toggleAccountNav : () => { window.location.href = '/loginemail' }} />
            {accountNavOpen &&
                <div className='account-navigation-container'>
                    <div className="anc-row1" onClick={toggleAccountNav}>
                        <i className="fa fa-times"></i>
                    </div>
                    <div className="anc-row2">
                        <img src={Logo} alt="" />
                    </div>
                    <div className="anc-row3">
                        <ul>
                            <Link to='/editprofile'>
                                <li >
                                    Manage Account
                                </li>
                            </Link>
                            <li>
                                <Link to={`/profile/${user?.id}`}> My Profile & Listings</Link>
                            </li>
                            <Link to='/notificationlist'>
                                <li>
                                    <div className='notification-btn'>
                                        Notifications
                                        {unreadNotifications.length > 0 ?
                                            <div className="notification-counter">
                                                {unreadNotifications.length}
                                            </div>
                                            : null
                                        }
                                    </div>
                                </li>
                            </Link>
                            <Link to='/wishlist'>
                                <li>
                                    My Wishlist
                                </li>
                            </Link>
                            <Link to='/deactivateaccount'>
                                <li>
                                    Settings
                                </li>
                            </Link>
                            <li onClick={logout}>
                                Logout
                            </li>
                        </ul>
                    </div>
                </div>
            }
        </>
    )
}

export default AccountNav
