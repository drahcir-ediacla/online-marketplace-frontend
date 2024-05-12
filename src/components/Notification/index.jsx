import React, { useState, useEffect, useRef } from 'react';
import {Link} from 'react-router-dom'
import axios from '../../apicalls/axios';
import './style.scss'
import { ReactComponent as BellIcon } from '../../assets/images/bell-regular.svg';
import { ReactComponent as TriangleIcon } from '../../assets/images/triangle-up.svg';

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

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


  const notificationRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target) &&
        !event.target.closest('.bell-icon')
      ) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };



  return (
    <div className='notification'>
      <div className='bell-icon' onClick={toggleDropdown}><BellIcon /></div>
      {unreadNotifications.length > 0 ? <div className="red-counter">{unreadNotifications.length}</div> : null}
      {isDropdownVisible && (
        <div className="notification-dropdown-container" ref={notificationRef}>
          <div className="notification-dropdown">
            <div className='triangle-icon'><TriangleIcon /></div>
            <div className="notification-header">
              <div className="notification-counter">Notifications</div>
              {notifications.length === 0 ? (
                null
              ) : (
                <div className="see-all"><Link to='/notificationlist'>See all</Link></div>
              )}
            </div>
            {notifications.length === 0 ? (
              <div className='no-notifications'>You don't have any notifications</div>
            ) : (
              <ul>
                {notifications.map((notification) => (
                  <li key={notification.id} onClick={() => markAsRead(notification.id)}>
                    <div className="user-image">
                      <img src={notification.subjectUser.profile_pic} alt="" />
                    </div>
                    <span style={{width: '100%'}} dangerouslySetInnerHTML={{ __html: notification.message }} />
                    {!notification.read && (
                      <div className="circle-container">
                        <div className='circle'></div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationComponent;