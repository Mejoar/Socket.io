import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import socketService from '../socket/socket';

const MessageInput = () => {
  const { state, sendMessage } = useChat();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    sendMessage(message);
    setMessage('');
    setIsTyping(false);
    socketService.stopTyping(state.currentRoom);
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
      socketService.startTyping(state.currentRoom);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socketService.stopTyping(state.currentRoom);
    }, 3000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // For demo purposes, we'll just send the file name
    // In a real app, you'd upload to a server and get a URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileData = {
        type: 'file',
        name: file.name,
        size: file.size,
        data: e.target.result,
        room: state.currentRoom
      };
      socketService.sendFile(fileData);
    };
    reader.readAsDataURL(file);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div style={styles.container}>
      {/* Typing indicator */}
      {state.typingUsers[state.currentRoom] && state.typingUsers[state.currentRoom].length > 0 && (
        <div style={styles.typingIndicator}>
          <div style={styles.typingDots}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span style={styles.typingText}>
            {state.typingUsers[state.currentRoom].join(', ')} 
            {state.typingUsers[state.currentRoom].length === 1 ? ' is' : ' are'} typing...
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputContainer}>
          <textarea
            style={styles.input}
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            rows="1"
            disabled={state.connectionStatus !== 'connected'}
          />
          
          <div style={styles.actions}>
            <button
              type="button"
              style={styles.actionButton}
              onClick={() => setShowFileUpload(!showFileUpload)}
              title="Attach file"
            >
              📎
            </button>
            
            <button
              type="submit"
              style={styles.sendButton}
              disabled={!message.trim() || state.connectionStatus !== 'connected'}
            >
              Send
            </button>
          </div>
        </div>

        {showFileUpload && (
          <div style={styles.fileUpload}>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              style={styles.fileInput}
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
            <small style={styles.fileHint}>
              Supported: Images, PDF, Word documents, Text files (Max 5MB)
            </small>
          </div>
        )}
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  typingIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '5px 10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '20px',
    fontSize: '0.8rem',
    color: '#666',
  },
  typingDots: {
    display: 'flex',
    gap: '2px',
  },
  typingText: {
    fontStyle: 'italic',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  inputContainer: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    padding: '12px',
    border: '2px solid #ddd',
    borderRadius: '20px',
    fontSize: '14px',
    resize: 'none',
    outline: 'none',
    maxHeight: '120px',
    minHeight: '40px',
    fontFamily: 'inherit',
  },
  actions: {
    display: 'flex',
    gap: '5px',
  },
  actionButton: {
    padding: '8px 12px',
    backgroundColor: '#f0f0f0',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.2s',
  },
  sendButton: {
    padding: '8px 16px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
  },
  fileUpload: {
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    border: '1px dashed #ddd',
  },
  fileInput: {
    width: '100%',
    marginBottom: '5px',
  },
  fileHint: {
    color: '#666',
    fontSize: '0.8rem',
  },
};

// Add CSS for typing dots animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes typing-dots {
    0%, 60%, 100% { opacity: 0.2; }
    30% { opacity: 1; }
  }
  
  .typing-dots span {
    width: 4px;
    height: 4px;
    background-color: #666;
    border-radius: 50%;
    display: inline-block;
    animation: typing-dots 1.4s infinite;
  }
  
  .typing-dots span:nth-child(1) { animation-delay: 0s; }
  .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
  .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
`;
document.head.appendChild(styleSheet);

export default MessageInput;
