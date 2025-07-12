import React, { useState, useEffect } from 'react';
import { useChat } from '../context/ChatContext';

const MessagePagination = ({ room }) => {
  const { state, dispatch } = useChat();
  const [loading, setLoading] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [page, setPage] = useState(1);
  const messagesPerPage = 20;

  const loadOlderMessages = async () => {
    if (loading || !hasMoreMessages) return;

    setLoading(true);
    
    try {
      // Simulate API call for older messages
      // In a real app, this would fetch from server
      const olderMessages = generateOlderMessages(room, page, messagesPerPage);
      
      if (olderMessages.length === 0) {
        setHasMoreMessages(false);
      } else {
        // Add older messages to the beginning of the current messages
        const currentMessages = state.messages[room] || [];
        const updatedMessages = [...olderMessages, ...currentMessages];
        
        dispatch({
          type: 'SET_MESSAGES',
          payload: { room, messages: updatedMessages }
        });
        
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error loading older messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Simulate generating older messages (in real app, this would be an API call)
  const generateOlderMessages = (room, page, limit) => {
    const messages = [];
    const startIndex = (page - 1) * limit;
    
    // Stop generating after page 3 to simulate finite message history
    if (page > 3) return [];
    
    for (let i = 0; i < limit; i++) {
      const messageIndex = startIndex + i;
      const timestamp = new Date(Date.now() - (messageIndex + 1) * 60000 * 5); // 5 minutes apart
      
      messages.push({
        id: `older-${room}-${messageIndex}`,
        text: `This is an older message #${messageIndex + 1} in ${room}`,
        sender: `User${(messageIndex % 3) + 1}`,
        timestamp: timestamp.toISOString(),
        status: 'read',
        room
      });
    }
    
    return messages.reverse(); // Oldest first
  };

  useEffect(() => {
    // Reset pagination when room changes
    setPage(1);
    setHasMoreMessages(true);
  }, [room]);

  if (!hasMoreMessages) {
    return (
      <div style={styles.endMessage}>
        📚 You've reached the beginning of this conversation
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <button
        onClick={loadOlderMessages}
        disabled={loading}
        style={{
          ...styles.loadButton,
          opacity: loading ? 0.6 : 1,
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            Loading older messages...
          </div>
        ) : (
          '↑ Load older messages'
        )}
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    padding: '10px 20px',
    borderBottom: '1px solid #eee',
  },
  loadButton: {
    padding: '8px 16px',
    backgroundColor: '#f0f0f0',
    border: '1px solid #ddd',
    borderRadius: '20px',
    fontSize: '14px',
    color: '#666',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid #f0f0f0',
    borderTop: '2px solid #666',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  endMessage: {
    textAlign: 'center',
    padding: '15px 20px',
    color: '#999',
    fontSize: '14px',
    borderBottom: '1px solid #eee',
    backgroundColor: '#fafafa',
  },
};

export default MessagePagination;
