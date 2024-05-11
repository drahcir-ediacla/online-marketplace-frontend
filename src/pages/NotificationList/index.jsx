import React, { useState, useEffect } from 'react'
import axios from '../../apicalls/axios';
import './style.scss'
import Header from '../../layouts/Header';
import Footer from '../../layouts/Footer';
import ManageAccountNav from '../../layouts/ManageAccountNav';
import Avatar from '../../assets/images/review-1_icon.png';



const NotificationList = () => {

    const [notifications, setNotifications] = useState([]);
    const [unreadNotifications, setUnreadNotifications] = useState([]);
    const [activeTab, setActiveTab] = useState(0);

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

                setUnreadNotifications(response.data);

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
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
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
                                <div className='view-options-btn-container'>
                                    <button className={`all-btn ${activeTab === 0 ? 'active' : ''}`} onClick={() => openContent(0)}>ALL</button>
                                    <button className={`unread-btn ${activeTab === 1 ? 'active' : ''}`} onClick={() => openContent(1)}>UNREAD</button>
                                </div>
                                {notifications.length === 0 ? (
                                    <div style={{ display: activeTab === 0 ? 'block' : 'none' }} className='no-notif'>You don't have unread notifications</div>
                                ) : (
                                    <ul style={{ display: activeTab === 0 ? 'block' : 'none' }}>
                                    {notifications.map((notification) => (
                                        <li key={notification.id} onClick={() => markAsRead(notification.id)}>
                                            <div className="user-avatar">
                                                <img src={notification.subjectUser.profile_pic} alt="" />
                                            </div>
                                            <div className='notification-info'>
                                                <div><span dangerouslySetInnerHTML={{ __html: notification.message }} /></div>
                                                <div className="date">10/27/2022 17:07</div>
                                            </div>
                                            {!notification.read && (
                                                <div className="circle-container">
                                                    <div className="circle"></div>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                                )}
                                <ul style={{ display: activeTab === 1 ? 'block' : 'none' }}>
                                    <li><div  className='no-unread-notif'>You don't have unread notifications</div></li>
                                </ul>
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