import React, { useState, useEffect, useRef } from 'react'
import axios from '../../apicalls/axios';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import './style.scss'
import Header from '../../layouts/Header';
import Footer from '../../layouts/Footer';
import ManageAccountNav from '../../layouts/ManageAccountNav';
import { ReactComponent as ThreeDots } from '../../assets/images//three-dots.svg';


const NotificationList = () => {

    const [notifications, setNotifications] = useState([]);
    const [unreadNotifications, setUnreadNotifications] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const openContent = (tabIndex) => {
        setActiveTab(tabIndex);
    };

    useEffect(() => {
        // Fetch notifications when the component mounts
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('/api/notifications');

            // Sort notifications from latest to oldest based on createdAt
            const sortedNotifications = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            // Slice the array to select only the first 10 elements
            const limitedNotifications = sortedNotifications.slice(0, 10);
            setNotifications(limitedNotifications);

        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };


    useEffect(() => {
        const fetchUnreadNotifications = async () => {
            try {
                const response = await axios.get('/api/notifications/unread');

                const sortedNotifications = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                // Slice the array to select only the first 10 elements
                const limitedNotifications = sortedNotifications.slice(0, 10);

                setUnreadNotifications(limitedNotifications);

            } catch (error) {
                console.error('Error fetching unread notifications:', error);
            }
        }
        fetchUnreadNotifications()
    }, [])


    const markAsRead = async (notificationId) => {
        try {
            await axios.put(`/api/read-notifications/${notificationId}`, { read: true });
            // Update the state to reflect the change
            setNotifications(notifications.map(notification =>
                notification.id === notificationId ? { ...notification, read: true } : notification
            ));

            setUnreadNotifications(unreadNotifications.map(notification =>
                notification.id === notificationId ? { ...notification, read: true } : notification
            ));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };


    const notificationRef = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(e.target) &&
                !e.target.closest('.dots-container')
            ) {
                setIsDropdownVisible(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    return (
        <>
            <Header />
            <div className="notification-list-body">
                <div className="container">
                    <h3>Manage Account</h3>
                    <div className="box">
                        <div className="col-left"><ManageAccountNav /></div>
                        <div className="col-right">
                            <div className="notification-list-container">
                                <h5>NOTIFICATIONS</h5>
                                <div className="notification-btns">
                                    <div className='view-options-btn-container'>
                                        <button className={`all-btn ${activeTab === 0 ? 'active' : ''}`} onClick={() => openContent(0)}>ALL</button>
                                        <button className={`unread-btn ${activeTab === 1 ? 'active' : ''}`} onClick={() => openContent(1)}>UNREAD</button>
                                    </div>
                                    <div className='dots-container' onClick={toggleDropdown}>
                                        <div className='three-dots'>
                                            <ThreeDots />
                                        </div>
                                        {isDropdownVisible && (
                                            <div className="three-dots-dropdown-options" ref={notificationRef}>
                                                <ul>
                                                    <li>
                                                        <span>Mark All as Read</span>
                                                    </li>
                                                    <li>
                                                        <span>Clear All Notifications</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {notifications.length === 0 ? (
                                    <ul>
                                        <li>
                                            <div style={{ display: activeTab === 0 ? 'block' : 'none' }} className='no-notif'>You don't have any notifications</div>
                                        </li>
                                    </ul>
                                ) : (
                                    <div style={{ display: activeTab === 0 ? 'block' : 'none' }}>
                                        <ul>
                                            {notifications.map((notification) => (
                                                <li key={notification.id} >
                                                    <div className="delete-notif-btn">
                                                        <i class="fa fa-times"></i>
                                                    </div>
                                                    <div className="notification-container" onClick={() => markAsRead(notification.id)}>
                                                        <div className="user-avatar">
                                                            <img src={notification.subjectUser.profile_pic} alt="" />
                                                        </div>
                                                        <div className='notification-info'>
                                                            <div><span dangerouslySetInnerHTML={{ __html: notification.message }} /></div>
                                                            <div className="date">{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: enUS })}</div>
                                                        </div>
                                                        {!notification.read && (
                                                            <div className="circle-container">
                                                                <div className="circle"></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                        {notifications.length > 10 ? (
                                            <div className='view-more'>
                                                <button className='view-more-btn'>View more</button>
                                            </div>
                                        ) : (
                                            null
                                        )}
                                    </div>
                                )}
                                {unreadNotifications.length === 0 ? (
                                    <ul style={{ display: activeTab === 1 ? 'block' : 'none' }}>
                                        <li><div className='no-unread-notif'>You don't have unread notifications</div></li>
                                    </ul>
                                ) : (
                                    <div style={{ display: activeTab === 1 ? 'block' : 'none' }}>
                                        <ul>
                                            {unreadNotifications.map((notification) => (
                                                <li key={notification.id} >
                                                    <div className="delete-notif-btn">
                                                        <i class="fa fa-times"></i>
                                                    </div>
                                                    <div className="notification-container" onClick={() => markAsRead(notification.id)}>
                                                        <div className="user-avatar">
                                                            <img src={notification.subjectUser.profile_pic} alt="" />
                                                        </div>
                                                        <div className='notification-info'>
                                                            <div><span dangerouslySetInnerHTML={{ __html: notification.message }} /></div>
                                                            <div className="date">{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: enUS })}</div>
                                                        </div>
                                                        {!notification.read && (
                                                            <div className="circle-container">
                                                                <div className="circle"></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                        {notifications.length > 10 ? (
                                            <div className='view-more'>
                                                <button className='view-more-btn'>View more</button>
                                            </div>
                                        ) : (
                                            null
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}


export default NotificationList;