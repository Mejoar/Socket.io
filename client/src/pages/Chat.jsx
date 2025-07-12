import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import MessageInput from '../components/MessageInput';
import OnlineUsers from '../components/OnlineUsers';
import Notifications from '../components/Notifications';
import SearchMessages from '../components/SearchMessages';
import MessagePagination from '../components/MessagePagination';
import SoundNotifications from '../components/SoundNotifications';

const Chat = () => {
  const { state } = useChat();
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div style={styles.container}>
      <Notifications />
      <SoundNotifications />
      
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button 
            style={styles.menuButton}
            onClick={() => setShowSidebar(!showSidebar)}
          >
            ☰
          </button>
          <h1 style={styles.title}>🕶️ Incognito Wachira</h1>
        </div>
        
        <div style={styles.headerRight}>
          <div style={styles.connectionStatus}>
            <span style={{
              ...styles.statusDot,
              backgroundColor: state.connectionStatus === 'connected' ? '#4CAF50' : '#f44336'
            }}></span>
            {state.connectionStatus}
          </div>
          <span style={styles.username}>{state.user?.username}</span>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Sidebar */}
        {showSidebar && (
          <div style={styles.sidebar}>
            <Sidebar />
          </div>
        )}

        {/* Chat Area */}
        <div style={styles.chatArea}>
          <div style={styles.chatHeader}>
            <h2 style={styles.roomTitle}>
              {state.currentRoom === 'general' ? 'General Chat' : 
               state.currentRoom.startsWith('private_') ? 'Private Chat' : 
               `#${state.currentRoom}`}
            </h2>
            {state.unreadCounts[state.currentRoom] > 0 && (
              <span style={styles.unreadBadge}>
                {state.unreadCounts[state.currentRoom]}
              </span>
            )}
          </div>
          
          <div style={styles.chatContent}>
            <ChatWindow />
          </div>
          
          <div style={styles.messageInputContainer}>
            <MessageInput />
          </div>
        </div>

        {/* Online Users */}
        <div style={styles.onlineUsers}>
          <OnlineUsers />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#f5f5f5',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#667eea',
    color: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  menuButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '5px',
  },
  title: {
    margin: 0,
    fontSize: '1.5rem',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  connectionStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '0.9rem',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  username: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
  },
  mainContent: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#2c3e50',
    borderRight: '1px solid #ddd',
  },
  chatArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  chatHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '15px 20px',
    borderBottom: '1px solid #eee',
    backgroundColor: '#fafafa',
  },
  roomTitle: {
    margin: 0,
    fontSize: '1.2rem',
    color: '#333',
  },
  unreadBadge: {
    backgroundColor: '#ff4444',
    color: 'white',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  chatContent: {
    flex: 1,
    overflow: 'hidden',
  },
  messageInputContainer: {
    padding: '15px 20px',
    borderTop: '1px solid #eee',
    backgroundColor: '#fafafa',
  },
  onlineUsers: {
    width: '200px',
    backgroundColor: '#34495e',
    borderLeft: '1px solid #ddd',
  },
};

export default Chat;
