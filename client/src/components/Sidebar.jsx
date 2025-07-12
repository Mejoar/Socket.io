import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';

const Sidebar = () => {
  const { state, joinRoom, dispatch } = useChat();
  const [newRoomName, setNewRoomName] = useState('');
  const [showCreateRoom, setShowCreateRoom] = useState(false);

  const handleJoinRoom = (room) => {
    joinRoom(room);
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    
    const roomName = newRoomName.trim().toLowerCase();
    if (!state.rooms.includes(roomName)) {
      dispatch({ type: 'ADD_ROOM', payload: roomName });
    }
    joinRoom(roomName);
    setNewRoomName('');
    setShowCreateRoom(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Chat Rooms</h3>
        <button 
          style={styles.addButton}
          onClick={() => setShowCreateRoom(!showCreateRoom)}
        >
          +
        </button>
      </div>

      {showCreateRoom && (
        <form onSubmit={handleCreateRoom} style={styles.createForm}>
          <input
            type="text"
            placeholder="Room name"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            style={styles.input}
            maxLength={20}
          />
          <div style={styles.formButtons}>
            <button type="submit" style={styles.createButton}>Create</button>
            <button 
              type="button" 
              style={styles.cancelButton}
              onClick={() => setShowCreateRoom(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div style={styles.roomList}>
        {state.rooms.map((room) => (
          <div
            key={room}
            style={{
              ...styles.roomItem,
              backgroundColor: state.currentRoom === room ? '#3498db' : 'transparent',
            }}
            onClick={() => handleJoinRoom(room)}
          >
            <span style={styles.roomName}>#{room}</span>
            {state.unreadCounts[room] > 0 && (
              <span style={styles.unreadBadge}>
                {state.unreadCounts[room]}
              </span>
            )}
          </div>
        ))}
      </div>

      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Private Chats</h4>
        {Object.values(state.privateChats).map((chat) => (
          <div
            key={chat.id}
            style={{
              ...styles.roomItem,
              backgroundColor: state.currentRoom === chat.id ? '#3498db' : 'transparent',
            }}
            onClick={() => handleJoinRoom(chat.id)}
          >
            <span style={styles.roomName}>💬 {chat.name}</span>
            {state.unreadCounts[chat.id] > 0 && (
              <span style={styles.unreadBadge}>
                {state.unreadCounts[chat.id]}
              </span>
            )}
          </div>
        ))}
      </div>

      <div style={styles.footer}>
        <button 
          style={styles.logoutButton}
          onClick={() => dispatch({ type: 'SET_USER', payload: null })}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    color: 'white',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
    borderBottom: '1px solid #34495e',
  },
  title: {
    margin: 0,
    fontSize: '1.1rem',
  },
  addButton: {
    background: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '25px',
    height: '25px',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createForm: {
    padding: '15px 20px',
    borderBottom: '1px solid #34495e',
  },
  input: {
    width: '100%',
    padding: '8px',
    border: '1px solid #555',
    borderRadius: '4px',
    backgroundColor: '#34495e',
    color: 'white',
    marginBottom: '10px',
    outline: 'none',
  },
  formButtons: {
    display: 'flex',
    gap: '10px',
  },
  createButton: {
    flex: 1,
    padding: '6px 12px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  cancelButton: {
    flex: 1,
    padding: '6px 12px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  roomList: {
    flex: 1,
    overflowY: 'auto',
  },
  roomItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 20px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    borderBottom: '1px solid #34495e',
  },
  roomName: {
    fontSize: '0.9rem',
  },
  unreadBadge: {
    backgroundColor: '#e74c3c',
    color: 'white',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.7rem',
    fontWeight: 'bold',
  },
  section: {
    borderTop: '1px solid #34495e',
    padding: '10px 0',
  },
  sectionTitle: {
    margin: '0 0 10px 0',
    padding: '0 20px',
    fontSize: '0.9rem',
    color: '#bdc3c7',
  },
  footer: {
    padding: '15px 20px',
    borderTop: '1px solid #34495e',
    marginTop: 'auto',
  },
  logoutButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
};

export default Sidebar;
