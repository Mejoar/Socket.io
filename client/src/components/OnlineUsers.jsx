import React from 'react';
import { useChat } from '../context/ChatContext';
import SearchMessages from './SearchMessages';

const OnlineUsers = () => {
  const { state, sendPrivateMessage, joinRoom, dispatch } = useChat();

  const handleUserClick = (user) => {
    if (user.id === state.user.id) return; // Can't message yourself
    
    // Create private chat room
    const chatId = [state.user.id, user.id].sort().join('_');
    const chatName = `Private with ${user.username}`;
    
    // Add private chat to state
    dispatch({
      type: 'ADD_PRIVATE_CHAT',
      payload: {
        id: chatId,
        name: chatName,
        participants: [state.user.id, user.id]
      }
    });
    
    // Join the private chat room
    joinRoom(chatId);
  };

  return (
    <div style={styles.container}>
      <SearchMessages />
      
      <h4 style={styles.title}>Online Users</h4>
      <div style={styles.userList}>
        {state.onlineUsers.map(user => (
          <div 
            key={user.id} 
            style={{
              ...styles.userItem,
              cursor: user.id !== state.user.id ? 'pointer' : 'default',
              opacity: user.id === state.user.id ? 0.7 : 1
            }}
            onClick={() => handleUserClick(user)}
            title={user.id !== state.user.id ? `Click to start private chat with ${user.username}` : 'This is you'}
          >
            <span style={styles.statusDot}>🟢</span>
            <span style={styles.userName}>{user.username}</span>
            {user.id === state.user.id && <span style={styles.youLabel}>(You)</span>}
            {user.id !== state.user.id && <span style={styles.messageIcon}>💬</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    borderBottom: '1px solid #34495e',
    color: 'white',
  },
  title: {
    margin: 0,
    fontSize: '1rem',
    color: '#bdc3c7',
    marginBottom: '10px',
  },
  userList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  userItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '8px',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
  },
  statusDot: {
    fontSize: '8px',
  },
  userName: {
    fontSize: '0.9rem',
    color: 'white',
    flex: 1,
  },
  youLabel: {
    fontSize: '0.8rem',
    color: '#f39c12',
  },
  messageIcon: {
    fontSize: '12px',
    opacity: 0.7,
  },
};

export default OnlineUsers;

