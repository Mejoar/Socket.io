import React, { useEffect } from 'react';
import { useChat } from '../context/ChatContext';

const Notifications = () => {
  const { state, dispatch } = useChat();

  useEffect(() => {
    // Auto-remove notifications after 5 seconds
    state.notifications.forEach(notification => {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id });
      }, 5000);
    });
  }, [state.notifications, dispatch]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Show browser notifications
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      state.notifications.forEach(notification => {
        if (notification.type === 'message' || notification.type === 'private_message') {
          new Notification('New Message', {
            body: notification.message,
            icon: '/favicon.ico',
            tag: notification.id,
          });
        }
      });
    }
  }, [state.notifications]);

  if (state.notifications.length === 0) return null;

  return (
    <div style={styles.container}>
      {state.notifications.map(notification => (
        <div
          key={notification.id}
          style={{
            ...styles.notification,
            backgroundColor: getNotificationColor(notification.type),
          }}
          onClick={() => dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id })}
        >
          <div style={styles.notificationContent}>
            <span style={styles.notificationIcon}>
              {getNotificationIcon(notification.type)}
            </span>
            <span style={styles.notificationText}>{notification.message}</span>
          </div>
          <button style={styles.closeButton}>×</button>
        </div>
      ))}
    </div>
  );
};

const getNotificationColor = (type) => {
  switch (type) {
    case 'message':
      return '#4CAF50';
    case 'private_message':
      return '#2196F3';
    case 'user_joined':
      return '#FF9800';
    case 'user_left':
      return '#9E9E9E';
    default:
      return '#607D8B';
  }
};

const getNotificationIcon = (type) => {
  switch (type) {
    case 'message':
      return '💬';
    case 'private_message':
      return '🔒';
    case 'user_joined':
      return '👋';
    case 'user_left':
      return '👋';
    default:
      return '📢';
  }
};

const styles = {
  container: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '300px',
  },
  notification: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderRadius: '8px',
    color: 'white',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    cursor: 'pointer',
    animation: 'slideIn 0.3s ease-out',
  },
  notificationContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
  },
  notificationIcon: {
    fontSize: '16px',
  },
  notificationText: {
    fontSize: '14px',
    lineHeight: '1.4',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '18px',
    cursor: 'pointer',
    marginLeft: '10px',
    padding: '0',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

// Add CSS animation for notifications
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Notifications;
