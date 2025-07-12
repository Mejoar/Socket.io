import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { v4 as uuidv4 } from 'uuid';
import useErrorHandler from '../hooks/useErrorHandler';

const Login = () => {
  const [username, setUsername] = useState('');
  const { dispatch } = useChat();
  const { error, loading, handleAsync, clearError } = useErrorHandler();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    clearError();

    try {
      await handleAsync(async () => {
        // Simple username-based authentication
        const user = {
          id: uuidv4(),
          username: username.trim(),
          joinedAt: new Date().toISOString(),
        };
        dispatch({ type: 'SET_USER', payload: user });
      });
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h1 style={styles.title}>🕶️ Incognito Wachira</h1>
        <p style={styles.subtitle}>Anonymous chat - Enter your username to go incognito</p>
        
        {error && (
          <div style={styles.errorMessage}>
            {error}
            <button style={styles.errorClose} onClick={clearError}>×</button>
          </div>
        )}
        
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            disabled={loading}
            maxLength={20}
          />
          <button 
            type="submit" 
            style={{
              ...styles.button,
              opacity: loading || !username.trim() ? 0.6 : 1,
              cursor: loading || !username.trim() ? 'not-allowed' : 'pointer'
            }}
            disabled={loading || !username.trim()}
          >
            {loading ? (
              <span style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                Joining...
              </span>
            ) : (
              'Join Chat'
            )}
          </button>
        </form>
        
        <div style={styles.features}>
          <h3>Features:</h3>
          <ul>
            <li>Real-time messaging</li>
            <li>Multiple chat rooms</li>
            <li>Private messaging</li>
            <li>Typing indicators</li>
            <li>File sharing</li>
            <li>Message reactions</li>
            <li>Read receipts</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
  },
  loginBox: {
    background: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '10px',
    color: '#333',
    fontSize: '2rem',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px',
    border: '2px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  button: {
    padding: '12px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  features: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '5px',
  },
  errorMessage: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '15px',
    borderLeft: '4px solid #c62828',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorClose: {
    background: 'none',
    border: 'none',
    color: '#c62828',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '0',
    marginLeft: '10px',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

export default Login;
