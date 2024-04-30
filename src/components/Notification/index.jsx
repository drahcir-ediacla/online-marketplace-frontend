import React, { useState, useEffect } from 'react';
import axios from '../../apicalls/axios';
import './style.scss'
import { ReactComponent as BellIcon } from '../../assets/images/bell-regular.svg';
import { ReactComponent as TriangleIcon } from '../../assets/images/triangle-up.svg';

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications when the component mounts
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications');
      setNotifications(response.data);
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
    <div className='notification'>
      <div className='bell-icon'><BellIcon /></div>
      {unreadNotifications.length > 0 ? (
        <div className="red-counter">{unreadNotifications.length}</div>
      ) : (
        null
      )}
      <div className="notification-dropdown-container">
        <div className="notification-dropdown">
          <div className='triangle-icon'><TriangleIcon /></div>
          <div className="notification-header">
            <div className="notification-counter">{unreadNotifications.length} Unread Notifications</div>
            <div className="read-all">See all</div>
          </div>
          <ul>
            {notifications.map(notification => (
              <li key={notification.id} onClick={() => markAsRead(notification.id)}>
                <div className="user-image">
                  <img src={notification.subjectUser.profile_pic} alt="" />
                </div>
                <span dangerouslySetInnerHTML={{ __html: notification.message }} />
                {!notification.read && (
                  <div className="circle-container">
                    <div className='circle'></div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
};

export default NotificationComponent;
