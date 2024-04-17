import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ReactComponent as BellIcon } from '../../assets/images/bell-regular.svg';

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);

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

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/notifications/${notificationId}`, { read: true });
      // Update the state to reflect the change
      setNotifications(notifications.map(notification => 
        notification.id === notificationId ? { ...notification, read: true } : notification
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map(notification => (
          <li key={notification.id} style={{ fontWeight: notification.read ? 'normal' : 'bold' }}>
            {notification.message}
            {!notification.read && (
              <button onClick={() => markAsRead(notification.id)}>Mark as Read</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationComponent;
