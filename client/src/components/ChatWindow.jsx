import React, { useRef, useEffect, useState } from 'react';
import { useChat } from '../context/ChatContext';
import socketService from '../socket/socket';
import MessagePagination from './MessagePagination';

const ChatWindow = () => {
  const { state } = useChat();
  const chatEndRef = useRef(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages[state.currentRoom]]);

  const handleReaction = (messageId, reaction) => {
    socketService.sendReaction({
      roomId: state.currentRoom,
      messageId,
      reaction
    });
  };

  const handleMessageClick = (messageId) => {
    setSelectedMessage(selectedMessage === messageId ? null : messageId);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageStatus = (status) => {
    switch (status) {
      case 'sent': return '✓';
      case 'delivered': return '✓✓';
      case 'read': return '✓✓';
      default: return '';
    }
  };

  if (!state.messages[state.currentRoom] || state.messages[state.currentRoom].length === 0) {
    return (
      <div style={styles.chatWindow}>
        <div style={styles.emptyState}>
          <div style={styles.emptyStateIcon}>💬</div>
          <h3 style={styles.emptyStateTitle}>No messages yet</h3>
          <p style={styles.emptyStateText}>Start the conversation by sending a message!</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.chatWindow}>
      <MessagePagination room={state.currentRoom} />
      {state.messages[state.currentRoom]?.map((msg) => {
        const isOwnMessage = msg.sender === state.user.username;
        return (
          <div 
            key={msg.id} 
            style={{
              ...styles.messageContainer,
              alignSelf: isOwnMessage ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                ...styles.message,
                backgroundColor: isOwnMessage ? '#667eea' : '#ffffff',
                color: isOwnMessage ? '#ffffff' : '#333333',
              }}
              onClick={() => handleMessageClick(msg.id)}
            >
              {!isOwnMessage && (
                <div style={styles.senderName}>{msg.sender}</div>
              )}
              
              <div style={styles.messageContent}>
                {msg.type === 'file' ? (
                  <div style={styles.fileMessage}>
                    <span style={styles.fileIcon}>📎</span>
                    <span>{msg.text}</span>
                  </div>
                ) : (
                  <span>{msg.text}</span>
                )}
              </div>
              
              <div style={styles.messageFooter}>
                <span style={styles.timestamp}>{formatTime(msg.timestamp)}</span>
                {isOwnMessage && (
                  <span style={{
                    ...styles.messageStatus,
                    color: msg.status === 'read' ? '#4CAF50' : '#bbb'
                  }}>
                    {getMessageStatus(msg.status)}
                  </span>
                )}
              </div>
              
              {/* Reactions */}
              {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                <div style={styles.reactions}>
                  {Object.entries(msg.reactions).map(([reaction, users]) => (
                    <span key={reaction} style={styles.reaction}>
                      {reaction} {users.length}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Reaction picker */}
            {selectedMessage === msg.id && (
              <div style={styles.reactionPicker}>
                {['👍', '❤️', '😂', '😮', '😢', '😡'].map(reaction => (
                  <button
                    key={reaction}
                    style={styles.reactionButton}
                    onClick={() => {
                      handleReaction(msg.id, reaction);
                      setSelectedMessage(null);
                    }}
                  >
                    {reaction}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
      <div ref={chatEndRef} />
    </div>
  );
};

const styles = {
  chatWindow: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    backgroundColor: '#ecf0f1',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    textAlign: 'center',
    color: '#666',
  },
  emptyStateIcon: {
    fontSize: '4rem',
    marginBottom: '20px',
  },
  emptyStateTitle: {
    fontSize: '1.5rem',
    marginBottom: '10px',
    color: '#333',
  },
  emptyStateText: {
    fontSize: '1rem',
    margin: 0,
  },
  messageContainer: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '70%',
    position: 'relative',
  },
  message: {
    padding: '12px 16px',
    borderRadius: '18px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginBottom: '4px',
  },
  senderName: {
    fontSize: '0.8rem',
    fontWeight: 'bold',
    marginBottom: '4px',
    opacity: 0.8,
  },
  messageContent: {
    marginBottom: '4px',
    lineHeight: '1.4',
  },
  fileMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  fileIcon: {
    fontSize: '1.2rem',
  },
  messageFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '8px',
  },
  timestamp: {
    fontSize: '0.7rem',
    opacity: 0.7,
  },
  messageStatus: {
    fontSize: '0.7rem',
    fontWeight: 'bold',
  },
  reactions: {
    display: 'flex',
    gap: '4px',
    marginTop: '4px',
    flexWrap: 'wrap',
  },
  reaction: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: '2px 6px',
    borderRadius: '12px',
    fontSize: '0.7rem',
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
  },
  reactionPicker: {
    display: 'flex',
    gap: '4px',
    marginTop: '8px',
    padding: '8px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    position: 'absolute',
    top: '100%',
    left: 0,
    zIndex: 10,
  },
  reactionButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    padding: '4px 8px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};

export default ChatWindow;

