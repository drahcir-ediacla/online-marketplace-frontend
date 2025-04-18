import React, { useState, useEffect } from 'react';
import axios from '../../apicalls/axios';
import { Link } from 'react-router-dom';
import './style.scss'; // Ensure this imports your styling correctly
import useAuthentication from '../../hooks/authHook';
import Logo from '../../assets/images/Yogeek-logo.png';
import { ReactComponent as UserIcon } from '../../assets/images/user-icon.svg';

const AccountNav = () => {
    const { user } = useAuthentication();
    const [accountNavOpen, setAccountNavOpen] = useState(false);
    const [unreadNotifications, setUnreadNotifications] = useState([]);

    const toggleAccountNav = () => {
        setAccountNavOpen(prev => !prev);
    };

    const logout = async () => {
        const logoutUrl = `${process.env.REACT_APP_BASE_URL}/api/logout`;
    
        try {
            const response = await fetch(logoutUrl, {
                method: 'GET',
                credentials: 'include', // Include cookies for the logout API
            });
    
            if (response.ok) {
                // Redirect after successful logout
                window.location.href = '/';
            } else {
                console.error('Logout failed:', response.status, response.statusText);
                // Optionally show an error message to the user
            }
        } catch (error) {
            console.error('An error occurred during logout:', error);
            // Optionally show an error message to the user
        }
    };

    useEffect(() => {
        const fetchUnreadNotifications = async () => {
            try {
                const response = await axios.get('/api/notifications/unread');
                setUnreadNotifications(response.data);
            } catch (error) {
                console.error('Error fetching unread notifications:', error);
            }
        };

        fetchUnreadNotifications();
    }, []);

    const openManageAccountNav = () => {
        toggleAccountNav(); // Close account navigation after navigation
    };

    return (
        <>
            <UserIcon onClick={user ? toggleAccountNav : () => { window.location.href = '/loginemail' }} />

            {accountNavOpen && (
                <div className='account-navigation-container'>
                    <div className="anc-row1" onClick={toggleAccountNav}>
                        <i className="fa fa-times"></i>
                    </div>
                    <div className="anc-row2">
                        <img src={Logo} alt="" />
                    </div>
                    <div className="anc-row3">
                        <ul>
                            <li>
                                <Link to='/manage-account' onClick={openManageAccountNav}>
                                    Manage Account
                                </Link>
                            </li>
                            <li>
                                <Link to={`/profile/${user?.id}`} onClick={openManageAccountNav}>
                                    My Profile & Listings
                                </Link>
                            </li>
                            <li>
                                <Link to='/notificationlist' onClick={openManageAccountNav}>
                                    <div className='notification-btn'>
                                        Notifications
                                        {unreadNotifications.length > 0 &&
                                            <div className="notification-counter">
                                                {unreadNotifications.length}
                                            </div>
                                        }
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Link to='/wishlist' onClick={openManageAccountNav}>
                                    My Wishlist
                                </Link>
                            </li>
                            <li>
                                <Link to='/forum'>
                                    Community
                                </Link>
                            </li>
                            <li>
                                <Link to='/deactivateaccount' onClick={openManageAccountNav}>
                                    Settings
                                </Link>
                            </li>
                            <li onClick={logout}>
                                Logout
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
};

export default AccountNav;
